var express = require("express");
var router = express.Router();

const { isAuthorized } = require("../middleware/auth");
const {
  getUser,
  addUser,
  auth,
  logout,
} = require("../controllers/userController");

router.post("/adduser", addUser);
router.post("/login", auth);
router.post("/logout", logout);
router.get("/", isAuthorized, getUser);
//create getrewards logic

module.exports = router;
