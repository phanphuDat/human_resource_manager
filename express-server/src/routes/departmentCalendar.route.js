var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
const { allowRoles } = require('../Middleware/allowRoles');
const {
  createDepartmentCalendar,
  getAllDepartmentCalendars,
  getDepartmentCalendars,
  employeeGetCalendars,
  updateDepartmentCalendar,
  deleteDepartmentCalendar,
} = require('../controllers/departmentCalendar.controller');

//Share
router.get('/getAlldepartmentCalendar', passport.authenticate('jwt', { session: false }), getAllDepartmentCalendars);
router.get('/employeegetcalendars/:id', passport.authenticate('jwt', { session: false }), employeeGetCalendars);
//Search
router.get('/searchdepartmentCalendar', passport.authenticate('jwt', { session: false }), getDepartmentCalendars);


//Manager route
router.post('/createdepartmentCalendar', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), createDepartmentCalendar);
router.patch('/updatedepartmentCalendar', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), updateDepartmentCalendar);
router.delete('/deletedepartmentCalendar', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), deleteDepartmentCalendar);


module.exports = router;
