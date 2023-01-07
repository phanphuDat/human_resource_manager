var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { allowRoles } = require('../Middleware/allowRoles');
const {
  createDayOff,
  getAllDayOffs, empGetDayOffs,
  userSearchDayOffs, managerSearchDayOffs,
  managerUpdateDayOff, userUpdateDayOff,
  deleteDayOff
} = require('../controllers/dayOff.controller');


router.get('/usersearchdayoffs/:id', passport.authenticate('jwt', { session: false }), userSearchDayOffs);
router.get('/employeegetdayoffs/:id', passport.authenticate('jwt', { session: false }), empGetDayOffs);
router.patch('/userupdatedayoff/:id', passport.authenticate('jwt', { session: false }), userUpdateDayOff);
router.delete('/deletedayoff/:id', passport.authenticate('jwt', { session: false }), deleteDayOff);
router.post('/createdayoff', passport.authenticate('jwt', { session: false }), createDayOff);

router.get('/managersearchdayoffs', passport.authenticate('jwt', { session: false }), managerSearchDayOffs);
router.get('/getdayoffs', passport.authenticate('jwt', { session: false }), getAllDayOffs);
router.patch('/managerupdatedayoff/:id', passport.authenticate('jwt', { session: false }), allowRoles('manager', 'admin'), managerUpdateDayOff);


module.exports = router;
