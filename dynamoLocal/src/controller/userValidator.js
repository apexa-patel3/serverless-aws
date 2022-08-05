const multipart = require("aws-lambda-multipart-parser");
const joi = require('joi');
const { errorResponse, successResponse } = require('../utils/index');

const userAddValid = joi.object({
  fullName: joi.string().trim(true).required(),
  emailID: joi.string().email().trim(true).required(),
  designation: joi.string().trim(true).required(),
  department: joi.string().trim(true).required(),
  technologiesKnown: joi.string().trim(true).required(),
  projects: joi.string().trim(true).required(),
});

exports.userAddValidation = async (event, context) => {
  console.log('user validation start')
  const eventBody = multipart.parse(event, true);
  const { fullName, emailID, designation, department, technologiesKnown, projects } = eventBody;
  const payload = {
    fullName,
    emailID,
    designation,
    department,
    technologiesKnown,
    projects,
  };
  const { error } = userAddValid.validate(payload);
  if (error) {
    context.end();
    return errorResponse(error.message, 406);
  }
  console.log('validation end')
  return successResponse(payload, 200);
};

const userUpdateValid = joi.object({
  fullName: joi.string().trim(true),
  emailID: joi.string().email().trim(true),
  designation: joi.string().trim(true),
  department: joi.string().trim(true),
  technologiesKnown: joi.string().trim(true),
  projects: joi.string().trim(true),
});

exports.userUpdateValidation = async (event, context) => {
  const { fullName } = JSON.parse(event.body);
  const { emailID } = JSON.parse(event.body);
  const { designation } = JSON.parse(event.body);
  const { department } = JSON.parse(event.body);
  const { technologiesKnown } = JSON.parse(event.body);
  const { projects } = JSON.parse(event.body);
  const payload = {
    fullName,
    emailID,
    designation,
    department,
    technologiesKnown,
    projects,
  };

  const { error } = userUpdateValid.validate(payload);
  if (error) {
    context.end();
    return errorResponse(error.message, 406);
  }
  return successResponse(payload, 200);
};
