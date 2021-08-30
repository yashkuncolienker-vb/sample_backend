var express = require("express");
var router = express.Router();

const userRoutes = require("./users");
const { auth, getAccount } = require("../controllers/userController");
const { xAuthTokenValidation } = require("../middleware/xAuthTokenValidation");
const { isAuthorized } = require("../middleware/auth");

router.post("/auth", xAuthTokenValidation, auth);
router.get("/account", isAuthorized, getAccount);
router.use("/users", isAuthorized, isAuthorized, userRoutes);

module.exports = router;
