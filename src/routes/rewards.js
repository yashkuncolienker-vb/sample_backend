const express = require("express");
const router = express.Router();

const { isAuthorized } = require("../middleware/auth");
const {
  getRewards,
  createRewards,
} = require("../controllers/rewardController");

router.get("/", getRewards);
router.post("/", createRewards);

//create getrewards logic

module.exports = router;
