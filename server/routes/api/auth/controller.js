const { default: axios } = require("axios");
const bcrypt = require("bcrypt");
const shado = require("shado");
const { findUser, createUser, updateUser } = require("@repository/user");
const {
  createAuthCode,
  findAuthCode,
  destroyAuthCode,
  updateAuthCode,
} = require("@repository/authCode");
const {
  hashPassword,
  createJwtToken,
  generateHashedAuthCode,
  sendEmail,
} = require("@utils/core");
const { ApiError } = require("@utils/errors");
const EmailTemplates = require("@emailTemplates");

// Import configuration variables
const {
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  HOST,
  SIGNUP_TOKEN_SECRET,
  SIGNIN_TOKEN_SECRET,
} = require("@config");
const {
  findLink,
  deleteResetLink,
  updateResetLink,
} = require("@repository/resetLink");
const { randomBytes } = require("crypto");

// Define the redirect URL path for Google authentication callback
const REDIRECT_URL_PATH = "api/auth/google/callback";

// Define the default name for signin session token
const SIGNIN_TOKEN_NAME = "signin_tk";

// Sign in user with email and password
async function signin(req, res, next) {
  const { email, password } = req.body;

  // Find user by email
  const user = await findUser({
    query: { email },
    attributes: [
      "password",
      "id",
      "verified_email",
      "oauth_provider",
      "profile_picture",
    ],
  });
  if (!user) {
    return next(new ApiError("Incorrect Credentials", 401));
  }

  // Check if user is signed in with OAuth provider
  if (user.oauth_provider) {
    return next(new ApiError("Please sign in using your OAuth provider.", 401));
  }

  // Verify password
  if (!bcrypt.compareSync(password, user.password)) {
    return next(new ApiError("Incorrect Credentials", 401));
  }

  // Check if email is verified
  if (!user.verified_email) {
    return next(new ApiError("Email must be verified to continue", 401));
  }

  // Generate JWT token and set cookie
  generateJwtTokenAndSetSigninCookie(user.id, res);
  res.status(200).json({
    success: true,
    message: "Sign-in successful",
    data: {
      id: user.id,
      verified_email: user.verified_email,
      email: user.email,
      profile_picture: user.profile_picture,
      oauth_provider: user.oauth_provider,
    },
  });
}

// Sign up user with email, password, and full name
async function signup(req, res, next) {
  const { email, password, full_name } = req.body;

  // Check if email is already registered
  const existingUser = await findUser({ query: { email }, attributes: ["id"] });
  if (existingUser) {
    return next(new ApiError("Email Is Already Registered", 400));
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const user = await createUser({
    data: { email, full_name, password: hashedPassword, verified_email: true },
  });

  // Generate JWT token and set cookie
  generateJwtTokenAndSetSigninCookie(user.id, res);
  res.status(201).json({
    success: true,
    message: "Sign-up successful",
    data: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      verified_email: user.verified_email,
      oauth_provider: user.oauth_provider,
      created_at: user.created_at,
    },
  });
}

function signout(req, res) {
  res.clearCookie(SIGNIN_TOKEN_NAME);
  res.redirect("/");
}

// Initiate Google OAuth authentication
async function googleAuth(req, res) {
  const redirectURI = encodeURIComponent(`${HOST}/${REDIRECT_URL_PATH}`);
  const authURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code&scope=profile%20email`;

  res.redirect(authURL);
}

// Handle Google OAuth callback
async function googleAuthCallback(req, res) {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${HOST}/${REDIRECT_URL_PATH}`,
        grant_type: "authorization_code",
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user profile information
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const profileResponseData = profileResponse.data;
    const userExist = await findUser({
      email: profileResponseData.email,
      attributes: ["email", "oauth_provider", "oauth_provider_id", "id"],
    });
    if (!userExist) {
      const user = await createUser({
        data: {
          full_name: profileResponseData.name,
          email: profileResponseData.email,
          verified_email: profileResponseData.verified_email,
          profile_picture: profileResponseData.picture,
          oauth_provider: "google",
          oauth_provider_id: profileResponseData.id,
          oauth_access_token: accessToken,
        },
      });
      generateJwtTokenAndSetSigninCookie(user.id, res);
      return res.redirect("/");
    }
    if (userExist.oauth_provider_id !== profileResponseData.id) {
      return res.redirect(`/signup?error=oauth_provider_id_mismatch`);
    } else {
      generateJwtTokenAndSetSigninCookie(userExist.id, res);
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Error during Google OAuth:", error);
    res.redirect("/signup");
  }
}

// Verify email address with verification code
async function verifyEmail(req, res, next) {
  const { code, email } = req.body;

  const findAuth = await findAuthCode({
    query: { email },
    attributes: ["expires_at", "hash"],
  });

  if (
    !findAuth ||
    new Date() > new Date(findAuth.expires_at) ||
    !(await bcrypt.compare(code.toString(), findAuth.hash))
  ) {
    return next(new ApiError("Invalid Verification Code", 400));
  }

  const token = createJwtToken({ email }, SIGNUP_TOKEN_SECRET, "60 mins");
  await destroyAuthCode({ query: { email } });

  return res.status(200).json({
    success: true,
    message: "Email address verified",
    data: { token },
  });
}

// Request email verification code
async function requestEmailVerificationCode(req, res, next) {
  const { email, reason } = req.query;
  const [hash, code] = await generateHashedAuthCode();
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 10);

  const emailExists = await findUser({ query: { email }, attributes: ["id"] });
  if (emailExists) {
    return next(new ApiError("This Email Is Already Registered", 400));
  }

  const findAuth = await findAuthCode({
    query: { email },
    attributes: ["updated_at", "id"],
  });
  if (findAuth) {
    const minsDuration = shado.date
      .set(new Date(findAuth.updated_at), new Date())
      .getMinutes();

    if (minsDuration < 1) {
      return next(
        new ApiError(`Wait for 1 minute(s) before requesting a new code.`, 400)
      );
    }
    await updateAuthCode({
      query: { id: findAuth.id },
      data: { hash, expires_at: expiration },
    });
  } else {
    await createAuthCode({
      data: { hash, email, reason, expires_at: expiration },
    });
  }
  sendEmail({
    email,
    subject: "Email Verification",
    html: EmailTemplates.emailVerification(code),
  });
  return res
    .status(200)
    .json({ success: true, message: "Email verification code sent" });
}

async function resetPassword(req, res) {
  const { new_password } = req.body;
  const { slug } = req.params;

  // Find by slug
  const resetLink = await findLink({
    query: { slug },
    attributes: ["expires_at", "user_id"],
  });

  // Hash the new password
  const hashedPassword = await bcrypt.hash(new_password, 10);

  // Update user's password and delete password reset link
  await updateUser({
    query: { id: resetLink.user_id },
    data: { password: hashedPassword },
  });
  await deleteResetLink({ query: { slug } });
  return res
    .status(200)
    .json({ success: true, message: "Password reset successful" });
}

async function getResetPasswordLink(req, res, next) {
  const { email } = req.query;
  const user = await findUser({ query: { email }, attributes: ["id"] });
  if (!user) {
    return next(new ApiError(`Email not found`, 400));
  }

  const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours
  const slug = randomBytes(10).toString("base64Url");

  const existingResetLink = await findLink({ query: { user_id: user.id } });
  if (existingResetLink) {
    await updateResetLink({
      query: { user_id: user.id },
      data: { slug, expires_at: expiration },
    });
  }

  const resetLink = `${HOST}/reset-password/${slug}`;
  sendEmail({
    email,
    subject: "Reset Password",
    html: EmailTemplates.resetPassword(resetLink),
  });

  res.status(200).json({
    success: true,
    message: "Reset password link sent successfully",
  });
}

// Generate JWT token and set signin cookie
function generateJwtTokenAndSetSigninCookie(userId, res) {
  const token = createJwtToken(
    { user: { id: userId } },
    SIGNIN_TOKEN_SECRET,
    "60 mins"
  );
  res.cookie(SIGNIN_TOKEN_NAME, token, {
    signed: true,
    path: "/",
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: NODE_ENV === "development" ? false : true,
  });
}

// Export authentication functions
module.exports = {
  signin,
  signup,
  signout,
  verifyEmail,
  requestEmailVerificationCode,
  googleAuthCallback,
  resetPassword,
  googleAuth,
  getResetPasswordLink,
};
