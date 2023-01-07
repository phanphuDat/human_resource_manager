var express = require('express');
var router = express.Router();
var { authValidation } = require('../validations/index');
var { validateSchema } = require('../middleware/validate');
var passport = require('passport');
var jwt = require('jsonwebtoken');
const jwtSettings = require('../config/jwtSettings');
const { allowRoles } = require('../Middleware/allowRoles');
const {
  createNew,
  getNews,
  getNew,
  searchPosts,
  updateNew,
  deleteNew
} = require('../controllers/new.controller');
//share
router.get('/getnews', passport.authenticate('jwt', { session: false }), getNews);
router.get('/getnew/:id', passport.authenticate('jwt', { session: false }), getNew);
router.get('/searchnews', passport.authenticate('jwt', { session: false }), searchPosts);

//Admin route
router.post('/createnew', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), createNew);
router.patch('/updatenew/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), updateNew);
router.delete('/deletenew/:id', passport.authenticate('jwt', { session: false }), allowRoles('admin', 'manager'), deleteNew);


module.exports = router;
