const Joi = require("joi");

const updateSchema = Joi.object({
  role_id: Joi.number().required(),
  email: Joi.string().email().optional(),
  name: Joi.string().min(3).optional(),
  address: Joi.string().optional(),
  phone: Joi.number().optional(),
});

module.exports = updateSchema;
