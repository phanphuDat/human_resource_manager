var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { allowRoles } = require('../Middleware/allowRoles');
const {
  createPosition,
  getPositions,
  searchPositions,
  updatePosition,
  deletePosition
} = require('../controllers/position.controller');

//Admin route
router.get('/getpositions', passport.authenticate('jwt', { session: false }), allowRoles('admin'), getPositions,
);
router.get('/searchpositions', passport.authenticate('jwt', { session: false }), allowRoles('admin'), searchPositions,
);
router.post('/createposition', passport.authenticate('jwt', { session: false }), allowRoles('admin'), createPosition);
router.patch('/updateposition/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin'), updatePosition);
router.delete('/deleteposition/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin'), deletePosition);


module.exports = router;
