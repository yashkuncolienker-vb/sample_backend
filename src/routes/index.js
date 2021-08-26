var express = require("express");
var router = express.Router();

const userRoutes = require("./users");
const { auth } = require("../controllers/userController");
const { xAuthTokenValidation } = require("../middleware/xAuthTokenValidation");
const { isAuthorized } = require("../middleware/auth");

router.post("/auth", xAuthTokenValidation, auth);
router.use("/users", isAuthorized, userRoutes);

module.exports = router;
