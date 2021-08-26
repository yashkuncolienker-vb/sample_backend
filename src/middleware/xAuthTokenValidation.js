const jwt = require("jsonwebtoken");

const { customResponse } = require("../utility/helper");

const xAuthTokenValidation = async (req, res, next) => {
  let code, message;
  const authorizationHeaader = req.headers.xauthtoken;
  if (authorizationHeaader) {
    if (authorizationHeaader != process.env.XAuthToken) {
      code = 401;
      message = "Authentication error : XAuthToken header is not valid.";
      const resData = customResponse({ code, message });
      return res.status(code).send(resData);
    }
    next();
  } else {
    code = 401;
    message = "Authentication error:  XAuthToken header is  required.";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};
module.exports = { xAuthTokenValidation };
