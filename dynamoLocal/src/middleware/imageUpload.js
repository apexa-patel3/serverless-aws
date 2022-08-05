const { AWS } = require("../utils/awsconfigS3");
const multipart = require("aws-lambda-multipart-parser");
const { successResponse, errorResponse } = require("../utils/index");
const { v4: uuid } = require("uuid");

exports.upload = async (event, context) => {
  try {
    console.log("image start");
    const eventBody = multipart.parse(event, true);
    const ext = eventBody.profile.contentType.split("/")[1];
    const bufferData = eventBody.profile.content;

    const uid = uuid();
    const objS3 = new AWS.S3();
    // await objS3
    //   .putObject({
    //     Body: bufferData,
    //     Key: `${uid}.${ext}`,
    //     ContentType: ext,
    //     Bucket: process.env.BUCKET,
    //     ACL: 'public-read',
    //   }).promise();

    const params = {
      Body: bufferData,
      Key: `${uid}.${ext}`,
      ContentType: ext,
      Bucket: process.env.BUCKET,
      ACL: "public-read",
    };
    console.log(params);

    await objS3.upload(params).promise();

    const awsUrl = `https://${process.env.BUCKET}.s3.amazonaws.com/${uid}.${ext}`;
    console.log("image end", uid, awsUrl);
    return successResponse({ uid: uid, awsUrl: awsUrl }, 200);
  } catch (error) {
    context.end();
    console.log(error);
    return errorResponse(error.message, 500);
  }
};
