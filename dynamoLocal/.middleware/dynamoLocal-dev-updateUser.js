'use strict';
    
const src_controller_userValidator = require('../src/controller/userValidator');
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
    .then(wrappedHandler(src_controller_userValidator.userUpdateValidation.bind(src_controller_userValidator)))
    .then(wrappedHandler(src_controller_userController.updateUser.bind(src_controller_userController)));
};