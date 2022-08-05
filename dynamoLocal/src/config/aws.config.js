require('dotenv').config();

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  accessSecretKey: process.env.AWSSecretKey,
  region: process.env.REGION,
});

module.exports = {
  AWS,
};