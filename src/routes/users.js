var express = require("express");
var router = express.Router();

const { isAuthorized } = require("../middleware/auth");
const {
  getUserList,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  auth,
  logout,
} = require("../controllers/userController");

router.post("/adduser", addUser);
router.post("/login", auth);
router.post("/logout", logout);
router.get("/", isAuthorized, getUser);
// router.get("/", isAuthorized, getUserList);
router.get("/", isAuthorized, getUser);
router.put("/:id", isAuthorized, updateUser);
router.delete("/:id", isAuthorized, deleteUser);
//create getrewards logic

module.exports = router;
