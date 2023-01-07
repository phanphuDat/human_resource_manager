const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createDocument = Joi.object({
  body: Joi.object().keys({
    date: Joi.date().required(),
    userId: Joi.string().required().custom(objectId),
    reason: Joi.string().required(),
    money: Joi.number().required(),
  }),
});

const getDocuments = Joi.object({
  query: Joi.object().keys({
    sort: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
});

const getDocument = Joi.object({
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
});

const updateDocument = Joi.object({
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      date: Joi.date().required(),
      userId: Joi.string().required().custom(objectId),
      reason: Joi.string().required(),
      money: Joi.number().required(),
    })
    .min(1),
});

const deleteDocument = Joi.object({
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
});

module.exports = {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
};
