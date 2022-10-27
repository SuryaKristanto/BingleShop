const Joi = require("joi");

const updateOrderSchema = Joi.object({
  order_id: Joi.number().required(),
  status: Joi.string().min(7).required(),
});

module.exports = updateOrderSchema;
