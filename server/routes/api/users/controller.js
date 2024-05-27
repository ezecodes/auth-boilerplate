const { bucketName, imageUploadDirectory } = require("@config/aws");
const {
  updateUser,
  findUser,
  findAllUsers,
  destroyUser,
} = require("@repository/user");
const { ApiError } = require("@utils/errors");
const { getFieldsAndImageFiles, uploadImagesToBucket } = require("@utils/core");

async function getAllUser(req, res) {
  const users = await findAllUsers({
    page: 1,
    pageSize: 10,
    attributes: [
      "id",
      "full_name",
      "email",
      "verified_email",
      "oauth_provider",
      "profile_picture",
    ],
  });
  return res.status(200).json({
    success: true,
    message: users.length === 0 ? "No User Created" : "Users retrieved",
    data: users,
  });
}

async function getUser(req, res) {
  const user = await findUser({
    query: { id: req.params.user_id },
    attributes: [
      "id",
      "full_name",
      "email",
      "verified_email",
      "oauth_provider",
      "profile_picture",
    ],
  });
  return res.status(200).json({
    success: true,
    message: "User information retrieved",
    data: user,
  });
}

async function deleteUser(req, res) {
  await destroyUser({ query: { id: req.user.id } });
  res.clearCookie("signin_tk");

  res.status(200).json({
    success: true,
    message: "User deleted successfuly",
  });
}

const uploadProfilePicture = async (req, res, next) => {
  getFieldsAndImageFiles(req, async ([err, , imageFiles]) => {
    if (err) {
      return next(
        new ApiError("Error occured while proccessing your request", 400)
      );
    }
    if (imageFiles.length === 0) {
      return next(new ApiError("No picture selected", 400));
    }
    try {
      const imageNames = uploadImagesToBucket(
        imageFiles[0],
        bucketName,
        imageUploadDirectory
      );
      const url = `https://${bucketName}.s3.amazonaws.com/${imageUploadDirectory}/${imageNames[0]}`;
      await updateUser({
        query: { id: req.params.user_id },
        data: {
          profile_picture: url,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Profile Picture Updated",
      });
    } catch (err) {
      return next(new ApiError("Error occurred while uploading picture", 500));
    }
  });
};

module.exports = {
  getUser,
  getAllUser,
  deleteUser,
  uploadProfilePicture,
};
