const Joi = require("joi");

const createItemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  weight: Joi.number().required(),
  qty: Joi.number().required(),
});

module.exports = createItemSchema;
