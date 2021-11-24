var express = require("express");
var router = express.Router();

const { isAuthorized } = require("../middleware/auth");
const {
  getUserList,
  getUserDeatil,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/", getUserList);
router.get("/:id", getUserDeatil);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
//create getrewards logic

module.exports = router;
