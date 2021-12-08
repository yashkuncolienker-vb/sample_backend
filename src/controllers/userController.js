const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { addUserSchema, loginSchema } = require("../schema/userSchema");
const { customResponse, customPagination } = require("../utility/helper");

const userModel = require("../models/user");

const getUser = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Get users Detail' 
      #swagger.responses[200] = {
        schema:{
          "status":"success","code":200,"message":"","data":{"status":"active","_id":"61a7652ad4dae50710c5dd02","email":"jd@gmail.com","password":"$2b$10$CrlIF88L1c9ZK4hG/c3JLO5TTKto.ekx0SRL6EwmL9dTwOQ0xs7Nu","first_name":"john","last_name":"doe","role":"super_admin","created_at":"2021-12-01T12:06:02.055Z","updated_at":"2021-12-02T13:01:21.156Z","__v":0,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpkQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoia3VuY29saWVua2VyIiwiaWF0IjoxNjM4NDUwMDgxLCJleHAiOjE2Mzg2MjI4ODEsImlzcyI6InZiLWVycCJ9.Gp_bmr8jl9U9hCfqd3UAwXNlS3FW4oo6961oOIf9HRM"},"error":{}
        }
      }
  */
  let code, message;
  const authorizationHeader = req.headers.authorization;
  const token = req.headers.authorization.split(" ")[1];
  try {
    code = 200;
    const data = await userModel.findOne({ token });
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
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status":"success","code":201,"message":"","data":{"status":"active","_id":"61a8c83fcf8ab30ad4bfe56d","email":"qy@gmail.com","password":"$2b$10$vPgXLSCmtRFI2gvPFecFUe.hxHNUAEWLw4SxV7KQpSc6pqq84WPLy","first_name":"qwerty","last_name":"yuiop","role":"approver","created_at":"2021-12-02T13:21:03.645Z","updated_at":"2021-12-02T13:21:03.645Z","__v":0},"error":{}
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
    const encryptedPw = await bcrypt.hash(req.body.password, 10);
    const data = new userModel({ ...req.body, password: encryptedPw });
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

const auth = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Login User'
      #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            $email: 'qy@gmail.com',
            $password: 'qazxswedc'
        }
      }
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: { 
          "status":"success","code":201,"message":"","data":{"status":"active","_id":"61a8c83fcf8ab30ad4bfe56d","email":"qy@gmail.com","password":"$2b$10$vPgXLSCmtRFI2gvPFecFUe.hxHNUAEWLw4SxV7KQpSc6pqq84WPLy","first_name":"qwerty","last_name":"yuiop","role":"approver","created_at":"2021-12-02T13:21:03.645Z","updated_at":"2021-12-02T13:21:03.645Z","__v":0},"error":{}
        }
      }
  */
  let code, message, data;
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
    const user = await userModel.findOne({ email: req.body.email }).exec();
    if (!user) {
      code = 404;
      message = "Invalid request data";
      const resData = customResponse({
        code,
        message,
      });
      return res.status(code).send(resData);
    } else {
      const doesPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (doesPasswordMatch) {
        code = 200;

        data = await userModel.findOneAndUpdate(
          { email: req.body.email },
          { token },
          { new: true }
        );
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
    return res
      .status(code)
      .cookie("Token", token, {
        sameSite: "strict",
        path: "/",
        expires: new Date(Date.now() + 8 * (60 * 60 * 1000)),
        // httpOnly: true,
      })
      .send(resData);
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

const logout = async (req, res) => {
  /* 	#swagger.tags = ['User']
      #swagger.description = 'Logout User'
      #swagger.responses[201] = {
        description: 'User successfully added.',
        schema: {"status":"success","code":200,"message":"","data":{},"error":{}}
      }
  */
  let code, message, data;
  const authorizationHeader = req.headers.authorization.split(" ")[1];
  try {
    code = 200;
    let userData;
    userModel.findOne({ token: authorizationHeader }, function (err, user) {
      if (user && user.token) {
        user.token = undefined;
        user.save();
        userData = user;
      }
    });
    res.clearCookie("Token", { path: "/" });
    const resData = customResponse({ code, data: userData });
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
  getUser,
  addUser,
  auth,
  logout,
};
