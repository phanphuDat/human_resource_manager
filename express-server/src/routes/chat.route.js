var router = require("express").Router();
var {
  getChat,
  getChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addUserToGroup,
} = require("../controllers/chat.controller");


router.route("/").post(getChat).get(getChats);
router.route("/createGroup").post(createGroup);
router.route("/renameGroup").patch(renameGroup);
router.route("/removeFromGroup").patch(removeFromGroup);
router.route("/addUserToGroup").patch(addUserToGroup);

module.exports = router;
