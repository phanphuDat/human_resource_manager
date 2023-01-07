var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { allowRoles } = require('../Middleware/allowRoles');
const {
  createDepartment,
  searchDepartments,
  getDepartments,
  updateDepartment,
  deleteDepartment
} = require('../controllers/department.controller');

//Admin route
router.get('/getdepartments', passport.authenticate('jwt', { session: false }), getDepartments);
router.get('/searchdepartments', passport.authenticate('jwt', { session: false }), searchDepartments);
router.post('/createdepartment', passport.authenticate('jwt', { session: false }), allowRoles('admin'), createDepartment);
router.patch('/updatedepartment/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin'), updateDepartment);
router.delete('/deletedepartment/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin'), deleteDepartment);


module.exports = router;
