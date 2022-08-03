const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(3).required(),
    address: Joi.string().required(),
    phone: Joi.string().min(10).required()
})

module.exports = registerSchema