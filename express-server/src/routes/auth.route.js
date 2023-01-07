var express = require("express");
var router = express.Router();
var { authValidation } = require("../validations/index");
var validateSchema = require("../middleware/validate");
var passport = require("passport");
const {
  auth,
  searchUser,
  userChangePassword,
  requestPasswordReset,
  resetPassword
} = require("../controllers/auth.controller");
const protect = require("../middleware/authMid");
const { isResetTokenValid } = require("../middleware/allowRoles")

// login xong thì tạo token
router.post("/requestPassReset", requestPasswordReset);
// router.post('/resetPassword', resetPassword);
router.post('/passwordReset',isResetTokenValid, resetPassword);
router.get('/verifi-token',isResetTokenValid, (req, res)=> {
  res.status(200).json({ oke: true });
});

router.patch(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  userChangePassword
);
router.get("/users", protect, searchUser);
router.post("/:role", auth);

module.exports = router;
