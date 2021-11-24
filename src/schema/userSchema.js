const Joi = require("joi");

const addUserSchema = Joi.object()
  .keys({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(1).max(30).required(),
    password: Joi.string().min(8).max(50).required(),
    email: Joi.string().min(3).max(30).required(),
    role: Joi.string().min(3).max(30).required(),
  })
  .options({ abortEarly: false });

const loginSchema = Joi.object()
  .keys({
    email: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).max(50).required(),
  })
  .options({ abortEarly: false });

module.exports = { addUserSchema, loginSchema };
