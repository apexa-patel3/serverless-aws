const AWS = require('aws-sdk');

require('dotenv').config();

AWS.config.update({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
});

module.exports = {
  AWS,
};
