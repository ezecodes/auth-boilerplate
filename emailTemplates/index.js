const headers = `<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>
<style>
  body {
    font-family: system-ui, 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
  }

  .container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #333;
  }

  p {
    color: #555;
  }

  .verification-link {
    display: inline-block;
    padding: 10px 20px;
    margin-top: 20px;
    background-color: #007BFF;
    color: #fff;
    text-decoration: none;
    border-radius: 3px;
  }

  .footer {
    margin-top: 20px;
    text-align: center;
    color: #777;
  }
</style>
</head>`;

function emailVerification(code) {
  return `
  <!DOCTYPE html>
    <html lang="en">
    ${headers}
    <body>
      <div class="container">
        <p><span style="font-size: 1.5rem; font-weight: 500; "> ${code} </span></p>
        <p>Enter this code in the app to verify your account. If you didn't sign up for our service, you can safely ignore this email.</p>
        <div class="footer">
          <p>Regards,<br>Buildkit</p>
        </div>
      </div>
    </body>
  </html>
`;
}

function resetPassword(link) {
  return `
  <!DOCTYPE html>
    <html lang="en">
    ${headers}
    <body>
      <div class="container">
        <p>Click this link to reset your password <a href="${link}"> Reset Password </a> .</p>
        <div class="footer">
          <p>Regards,<br>Buildkit</p>
        </div>
      </div>
    </body>
  </html>
`;
}

module.exports = {
  emailVerification,
  resetPassword,
};
