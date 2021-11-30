var express = require("express");
var router = express.Router();

const { isAuthorized } = require("../middleware/auth");
const {
  getUserList,
  getUserDeatil,
  addUser,
  updateUser,
  deleteUser,
  auth,
  logout,
} = require("../controllers/userController");

router.post("/signup", addUser);
router.post("/login", auth);
router.post("/logout", logout);

router.get("/", isAuthorized, getUserList);
router.get("/:id", isAuthorized, getUserDeatil);
router.put("/:id", isAuthorized, updateUser);
router.delete("/:id", isAuthorized, deleteUser);
//create getrewards logic

module.exports = router;
