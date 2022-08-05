'use strict';
    
const src_controller_userValidator = require('../src/controller/userValidator');
const src_middleware_imageUpload = require('../src/middleware/imageUpload');
const src_controller_userController = require('../src/controller/userController');

module.exports.handler = async (event, context) => {
  let end = false;
  context.end = () => end = true;

  const wrappedHandler = handler => prev => {
    if (end) return prev;
    context.prev = prev;
    return handler(event, context);
  };

  return Promise.resolve()
    .then(wrappedHandler(src_controller_userValidator.userAddValidation.bind(src_controller_userValidator)))
    .then(wrappedHandler(src_middleware_imageUpload.upload.bind(src_middleware_imageUpload)))
    .then(wrappedHandler(src_controller_userController.addUser.bind(src_controller_userController)));
};