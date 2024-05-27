// Your AWS config file for s3 image bucket storage
const { S3Client } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: fromEnv(),
});

const bucketName = "YOUR_BUCKET_NAME";
const imageUploadDirectory = "your-image-upload-directory-name";

module.exports = { s3Client, bucketName, imageUploadDirectory };
