const { v4: uuid } = require("uuid");
const multipart = require("aws-lambda-multipart-parser");
const { AWS } = require("../config/aws.config");

const s3 = new AWS.S3();
const {
  successResponse,
  errorResponse,
} = require("../helper/responses.helper");

exports.uploadS3 = async (event, context) => {
  try {   
    const eventBody = multipart.parse(event, true);
    const ext = eventBody.profile.contentType.split("/")[1];
    const bufferData = eventBody.profile.content;

    const userId = uuid();
    const fileName = `${userId}.${ext}`;

    const params = {
      Body: bufferData,
      Key: fileName,
      ContentType: ext,
      Bucket: process.env.BUCKET,
      ACL: "public-read",
    };

    await s3.upload(params).promise();

    // Send response to next middleware
    const awsUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${userId}.${ext}`;
    console.log(awsUrl, userId)
    return successResponse({ userId: userId, objURL: awsUrl }, 200);
  } catch (error) {
    context.end();
    return errorResponse(error.message, 500);
  }
};
