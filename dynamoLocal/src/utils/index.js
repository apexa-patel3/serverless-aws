const successResponse = (data, code = 200) => ({
  statusCode: code,
  body: JSON.stringify(data, null, 3),
});

const errorResponse = (errorMessage = 'Something went wrong', code = 500) => ({
  statusCode: code,
  body: JSON.stringify(errorMessage),
});

module.exports = { successResponse, errorResponse };
