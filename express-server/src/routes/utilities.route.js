var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { allowRoles } = require('../Middleware/allowRoles');
const {
  managerGetSalarys, managerTimekeeping,
  userGetSalary,
  getWorkSchedules, searchWorkSchedules
} = require('../controllers/utilities.controller');

//Statisticals
router.get('/usergetsalary/:id', passport.authenticate('jwt', { session: false }), userGetSalary);
router.get('/managertimekeeping', passport.authenticate('jwt', { session: false }), managerTimekeeping);
router.get('/managergetsalarys', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), managerGetSalarys);


// WorkSchedules
router.get('/getworkschedules', passport.authenticate('jwt', { session: false }), getWorkSchedules);
router.get('/searchworkschedules', passport.authenticate('jwt', { session: false }), searchWorkSchedules);


//inout


module.exports = router;
