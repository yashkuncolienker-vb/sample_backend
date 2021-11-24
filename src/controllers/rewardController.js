const rewardsModal = require("../models/reward");
const { rewardSchema } = require("../schema/rewardSchema");
const { customResponse } = require("../utility/helper");

const getRewards = async (req, res) => {
  let rewards;
  try {
    rewards = await rewardsModal.find({});
    res.status(200).send(rewards);
  } catch (error) {
    res.status(401).send(error);
  }
};

const createRewards = async (req, res) => {
  try {
    const { error } = rewardSchema.validate(req.body);
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
    const rewards = await new rewardsModal(req.body).save();
    res.status(200).send(rewards);
  } catch (error) {
    res.status(401).send(error);
  }
};

module.exports = { getRewards, createRewards };
