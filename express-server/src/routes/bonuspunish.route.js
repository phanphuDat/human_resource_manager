var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { allowRoles } = require('../Middleware/allowRoles');
const {
  createbonuspunishs,
  getBonusPunishs,
  searchBonusPunishs,
  updateBonusPunish,
  deleteBonusPunish
} = require('../controllers/bonuspunish.controller');

//Admin route
router.get('/getbonuspunishs', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), getBonusPunishs);
router.get('/searchbonuspunishs', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), searchBonusPunishs);
router.post('/createbonuspunishs', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), createbonuspunishs);
router.patch('/updatebonuspunish/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin','manager'), updateBonusPunish);
router.delete('/deletebonuspunish/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin','manager'), deleteBonusPunish);


module.exports = router;
