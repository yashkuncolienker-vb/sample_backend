const jwt = require("jsonwebtoken");

const { customResponse } = require("../utility/helper");

const isAuthorized = async (req, res, next) => {
  let code, message;
  const authorizationHeaader = req.headers.authorization;
  let result;
  if (authorizationHeaader) {
    const secret = process.env.JWT_SECRET;
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const options = {
      expiresIn: process.env.EXPIRESIN,
      issuer: process.env.ISSUER,
    };
    try {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          code = 401;
          message = err.message;
          const resData = customResponse({
            code,
            message,
            err,
          });
          return res.status(code).send(resData);
        }
        result = jwt.verify(token, process.env.JWT_SECRET, options);
        req.decoded = result;
        next();
      });
    } catch (error) {
      code = 401;
      message = "Invalid Token";
      const resData = customResponse({
        code,
        message,
        err: error,
      });
      return res.status(code).send(resData);
    }
  } else {
    code = 401;
    message = "Authentication error. Token required.";
    const resData = customResponse({ code, message });
    return res.status(code).send(resData);
  }
};
module.exports = { isAuthorized };
