const Joi = require("joi");

const updateItemSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  price: Joi.number().optional(),
  weight: Joi.number().optional(),
  qty: Joi.number().optional(),
});

module.exports = updateItemSchema;
