var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { allowRoles } = require('../Middleware/allowRoles');
const upload = require('../Middleware/upload');
var multer = require('multer');
const {
  createUser,
  getAllUsers,
  getUsers,
  getUser,
  adminUpdateUser,
  employeeUpdateUser,
  deleteUser,
} = require('../controllers/user.controller');

//Employee route
router.get('/getUser', passport.authenticate('jwt', { session: false }), getUser);
router.patch('/employeeupdateuser', passport.authenticate('jwt', { session: false }), upload.single('file'), employeeUpdateUser);

//Admin route
router.get('/getallusers', passport.authenticate('jwt', { session: false }), allowRoles('admin'), getAllUsers);
router.get('/getusers', passport.authenticate('jwt', { session: false }), allowRoles('admin'), getUsers);
router.post('/createuser', passport.authenticate('jwt', { session: false }), allowRoles('admin'), createUser);
router.patch('/adminupdateuser/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin'), upload.single('file'), adminUpdateUser);
router.delete('/deleteuser/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin'), deleteUser);


module.exports = router;
