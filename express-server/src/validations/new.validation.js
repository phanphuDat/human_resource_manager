const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDocument = Joi.object({
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    time: Joi.date().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    file: Joi.string(),
    pin: Joi.boolean(),
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
      userId: Joi.string().required().custom(objectId),
      time: Joi.date().required(),
      title: Joi.string().required(),
      content: Joi.string().required(),
      comment: Joi.array().items(
        Joi.object({
          userId: Joi.string().custom(objectId).required(),
          content: Joi.string().required(),
        })
      ),
      file: Joi.string(),
      pin: Joi.boolean(),
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
