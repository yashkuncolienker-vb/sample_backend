const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { addUserSchema, loginSchema } = require("../schema/userSchema");
const { customResponse, customPagination } = require("../utility/helper");

const userModel = require("../models/user");

const getUserList = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get users list' 
      #swagger.parameters['page'] = {
        in: 'query',
        type: 'integer',
        description: 'Page number' 
      }
      #swagger.parameters['limit'] = {
        in: 'query',
        type: 'integer',
        description: 'Data limit per page' 
      }
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "pageCount": 1,
            "totalCount": 1,
            "currentPage": 1,
            "results": [
              {
                "_id": "610d090636ba149966bd3b55",
                "first_name": "Jhon",
                "last_name": "Doe",
                "email": "jhon@valuebound.com",
                "role": "admin"
              }
            ]
          },
          "error": {}
        }
      }
  */
  let code, message;
  const searchString = [{ role: { $regex: "" } }];

  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 15;
  if (req.query.first_name) {
    searchString.push({ first_name: { $regex: req.query.first_name } });
  }
  if (req.query.last_name) {
    searchString.push({ last_name: req.query.last_name });
  }
  if (req.query.email) {
    searchString.push({ email: req.query.email });
  }
  try {
    code = 200;
    const users = await userModel.find({
      $and: [{ $and: searchString }],
    });
    const data = customPagination({ data: users, page, limit });
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const getUserDeatil = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get users Detail' 
      #swagger.responses[200] = {
        schema:{
          "status": "success",
          "code": 200,
          "message": "",
          "data":  {
            "_id": "610bc1b31b82a66f6bcd64ea",
            "first_name": "akash",
            "last_name": "kumar",
            "email": "akash@gmail.com",
            "role": "admin",
            "__v": 0
          },
          "error": {}
        }
      }
  */
  let code, message;
  const _id = req.params.id;
  try {
    code = 200;
    const data = await userModel.findById({ _id });
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const addUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Add new user'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $first_name: 'Jhon',
            $last_name: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status": "success",
          "code": 201,
          "message": "",
          "data": {
            "first_name": 'Jhon',
            "last_name": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin', 
          },
          "error": {}
        }
      }
  */
  let code, message;
  const { error } = addUserSchema.validate(req.body);
  if (error) {
    code = 422;
    message = "Invalid request data";
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }
  try {
    code = 201;
    const data = new userModel(req.body);
    await data.save();
    const resData = customResponse({
      code,
      data,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const updateUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Update user' 
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $first_name: 'Jhon',
            $last_name: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[200] = {
        description: 'User successfully updated.',
        schema: { 
          "status": "success",
          "code": 200,
          "message": "",
          "data": {
            "first_name": 'Jhon',
            "last_name": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin'
          },
          "error": {}
        }
      }
  */
  let code, message;
  const _id = req.params.id;
  try {
    code = 200;
    message = "user successfully updated!";
    const user = await userModel.findOneAndUpdate(
      { _id },
      { ...req.body },
      { new: true }
    );
    await user.save();
    const resData = customResponse({
      code,
      data: user,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};

const deleteUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Delete user' 
      #swagger.responses[200] = {
      schema:{
        "status": "success",
        "code": 200,
        "message": "User deleted successfully",
        "data":  {
          "_id": "610bc1b31b82a66f6bcd64ea",
          "first_name": 'Jhon',
          "last_name": 'Doe',
          "email": 'jhon@valuebound.com',
          "role": 'admin',
          "__v": 0
        },
        "error": {}
      }
    }
  */
  let code, message;
  const _id = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(_id);
  if (!isValid) {
    code = 422;
    message = "Invalid objectId id";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
  try {
    code = 200;
    const user = await userModel.findByIdAndDelete({ _id });
    message = "user successfully deleted!";
    const resData = customResponse({
      code,
      data: user,
      message,
    });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};
const auth = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Add new user'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $first_name: 'Jhon',
            $last_name: 'Doe',
            $email: 'jhon@valuebound.com',
            $role: 'admin'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status": "success",
          "code": 201,
          "message": "",
          "data": { 
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSmhvbiBEb2UiLCJpYXQiOjE2Mjg0OTQ5NzksImV4cCI6MTYyODY2Nzc3OSwiaXNzIjoidmItY21zIn0.wdyX_wXWABr1BIw_7FzZKgowhixX8EXVN4ZojvzsaIU",
          },
          "error": {}
        }
      }
  */
  let code, message, data;
  console.log("Hello");
  const { error } = loginSchema.validate(req.body);

  if (error) {
    code = 422;
    message = "Invalid request data";
    const resData = customResponse({
      code,
      message,
      err: error && error.details,
    });
    return res.status(code).send(resData);
  }

  try {
    code = 200;
    const payload = { ...req.body };
    const options = {
      expiresIn: process.env.EXPIRESIN,
      issuer: process.env.ISSUER,
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, options);
    const reqBody = { token, ...req.body };
    const user = await userModel.findOne({ email: req.body.email }).exec();
    const encryptedPw = await bcrypt.hash(req.body.password, 10);
    if (!user) {
      code = 404;
      message = "Invalid request data";
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    } else {
      const userEntry = await userModel.findOne({ email: req.body.email });
      const doesPasswordMatch = await bcrypt.compare(
        req.body.password,
        userEntry.password
      );
      if (doesPasswordMatch) {
        code = 200;
        data = await userModel.findOneAndUpdate(
          { email: req.body.email },
          { ...reqBody, password: encryptedPw },
          { new: true }
        );
        await data.save();
      } else {
        code = 422;
        message = "Invalid request data";
        data = customResponse({
          code,
          message,
        });
      }
    }
    const resData = customResponse({ code, data });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};
const getAccount = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get Account'
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status": "success",
          "code": 200,
          "message": "",
          "data": { 
            "first_name": 'Jhon',
            "last_name": 'Doe',
            "email": 'jhon@valuebound.com',
            "role": 'admin', 
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSmhvbiBEb2UiLCJpYXQiOjE2Mjg0OTQ5NzksImV4cCI6MTYyODY2Nzc3OSwiaXNzIjoidmItY21zIn0.wdyX_wXWABr1BIw_7FzZKgowhixX8EXVN4ZojvzsaIU",
          },
          "error": {}
        }
      }
  */
  let code, message, data;
  const authorizationHeaader = req.headers.authorization.split(" ")[1];
  try {
    code = 200;
    const user = await userModel
      .findOne({ token: authorizationHeaader })
      .exec();
    const resData = customResponse({ code, data: user });
    return res.status(code).send(resData);
  } catch (error) {
    code = 500;
    message = "Internal server error";
    const resData = customResponse({
      code,
      message,
      err: error,
    });
    return res.status(code).send(resData);
  }
};
module.exports = {
  getUserList,
  getUserDeatil,
  addUser,
  updateUser,
  deleteUser,
  auth,
  getAccount,
};
