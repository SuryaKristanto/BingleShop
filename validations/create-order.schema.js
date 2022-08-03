const Joi = require("joi");

const createOrderSchema = Joi.object({
    items: Joi.array().items(Joi.object({
        item_id: Joi.number().required(),
        qty: Joi.number().required()
    }))
})

module.exports = createOrderSchema