var express = require("express");
var router = express.Router();

const userRoutes = require("./users");
const rewardRoutes = require("./rewards");
const { auth, getAccount } = require("../controllers/userController");
const { isAuthorized } = require("../middleware/auth");

router.post("/login", auth);
router.get("/account", isAuthorized, getAccount);
router.use("/users", isAuthorized, userRoutes);
router.use("/rewards", rewardRoutes);

module.exports = router;
