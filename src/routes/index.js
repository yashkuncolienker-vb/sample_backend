var express = require("express");
var router = express.Router();

const userRoutes = require("./users");
const rewardRoutes = require("./rewards");
const { getAuthTest } = require("../controllers/testAuth");
const { isAuthorized } = require("../middleware/auth");

router.use("/users", userRoutes);
router.use("/rewards", isAuthorized, rewardRoutes);
router.get("/protectedRoute", isAuthorized, getAuthTest);

module.exports = router;
