// const { v4: uuidv4 } = require('uuid');
const multipart = require('aws-lambda-multipart-parser');
const { AWS } = require('../config/aws.local.config');
const { successResponse, errorResponse } = require('../helper/responses.helper');

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

exports.addUser = async (event, context) => {
  const eventBody = multipart.parse(event, true);
  const { fullName, emailID, designation, department, technologiesKnown, projects } = eventBody;
  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {
      userId: JSON.parse(context.prev.body).userId,
      profile: JSON.parse(context.prev.body).awsUrl,
      fullName,
      emailID,
      designation,
      department,
      technologiesKnown,
      projects,
    },
  };
  try {
  await dynamoDbClient.put(params).promise();
    return successResponse("user added ", 200);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
};

exports.getUser = async () => {
  const params = {
    TableName: process.env.USERS_TABLE,
    // IndexName: "GSIdept",
    // KeyConditionExpression: "department = :department",
    // ExpressionAttributeValues: {
    //   ":department": "nodejs"
    // }  
    // IndexName: "LSIprojects",
    // KeyConditionExpression: "userId = :userId AND projects = :projects",
    // ExpressionAttributeValues: {
    //   ":userId" : "40933c70-b97e-4994-837d-957f1a8c9ad0",
    //   ":projects": "CF"
    // }
  };
  try {
    const { Items } = await dynamoDbClient.query(params).promise();
    if (Items) {
      return successResponse(Items, 200);
    }
    return errorResponse("found no user", 500);
  } catch (error) {
    return errorResponse(error, 500);
  }
};

exports.getOneUser = async (event) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      userId: event.pathParameters.userId,
    },
  };
  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      return successResponse(Item, 200);
    }
    return errorResponse("found no user", 500);
  } catch (error) {
    return errorResponse(error, 500);
  }
};

exports.deleteUser = async (event) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      userId: event.pathParameters.userId,
    },
  };
  try {
    await dynamoDbClient.delete(params).promise();
    return successResponse(`${event.pathParameters.userId} deleted`, 200);
  } catch (error) {
    return errorResponse(error, 500);
  }
};

exports.updateUser = async (event) => {
  const {
    fullName,
    emailID,
    designation,
    department,
    technologiesKnown,
    projects,
  } = JSON.parse(event.body);
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      userId: event.pathParameters.userId,
    },
    UpdateExpression:
      "set fullName = :fullName, emailID = :emailID, designation = :designation, department = :department, technologiesKnown = :technologiesKnown, projects = :projects",
    ExpressionAttributeValues: {
      ":fullName": fullName,
      ":emailID": emailID,
      ":designation": designation,
      ":department": department,
      ":technologiesKnown": technologiesKnown,
      ":projects": projects,
    },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    await dynamoDbClient.update(params).promise();
    return successResponse("user updated ", 200);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
};