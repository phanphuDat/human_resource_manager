var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
const { allowRoles } = require('../Middleware/allowRoles');
const {
  createUserShift,
  getAllUserShifts,
  getUserShifts,
  employeeGetShift,
  updateUserShift,
  deleteUserShift,
} = require('../controllers/userShift.controller');

// employee route
router.get('/employeegetshift/:id', passport.authenticate('jwt', { session: false }), employeeGetShift);
router.post('/createusershift', passport.authenticate('jwt', { session: false }), createUserShift);

// manager route
router.get('/getallusershifts', passport.authenticate('jwt', { session: false }), getAllUserShifts);
router.patch('/updateusershift/:id', passport.authenticate('jwt', { session: false }), updateUserShift);
router.get('/searchusershift', passport.authenticate('jwt', { session: false }), getUserShifts);

// dùng chung
router.delete('/deleteusershift/:id', passport.authenticate('jwt', { session: false }), deleteUserShift);

module.exports = router;
