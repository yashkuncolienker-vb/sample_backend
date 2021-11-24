const Joi = require("joi");

const rewardSchema = Joi.object()
  .keys({
    reward_name: Joi.string().required(),
    reward_display_name: Joi.string().max(3).required(),
    reward_type: Joi.string().required(),
    reward_sender: Joi.string().required(),
    recepients: Joi.string().required(),
    receiver_message: Joi.string().required(),
    announcement_type: Joi.string().required(),
    slack_channel: Joi.string(),
    channel_message: Joi.string(),
    status: Joi.string(),
    employee_id: Joi.number().min(3),
  })
  .options({ abortEarly: false });

module.exports = { rewardSchema };
