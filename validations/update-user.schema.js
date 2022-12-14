const Joi = require("joi");

const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().min(3).optional(),
  address: Joi.string().optional(),
  phone: Joi.number().min(10).optional(),
});

module.exports = updateUserSchema;
