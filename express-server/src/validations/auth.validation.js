const Joi = require('joi');
const { password } = require('./custom.validation');

const register = Joi.object({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
});

const login = Joi.object({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const logout = Joi.object({
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
});

const refreshTokens = Joi.object({
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
});

const forgotPassword = Joi.object({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
});

const resetPassword = Joi.object({
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
});

const verifyEmail = Joi.object({
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
