const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = Joi.object({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    fullname: Joi.string().required(),
    // role: Joi.string().required().valid('employee', 'manager'),
  }),
});

const getUsers = Joi.object({
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
});

const getUser = Joi.object({
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
});

const updateUser = Joi.object({
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
});

const deleteUser = Joi.object({
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
