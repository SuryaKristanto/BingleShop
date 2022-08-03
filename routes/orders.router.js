const { createOrder } = require('../controllers/orders.controller')

const { authorization } = require('../middlewares/authorization.middleware')

const validation = require('../middlewares/validation.middleware')

const createOrderSchema = require('../validations/create-order.schema')

const router = require('express').Router()

router.post('', authorization(''), validation(createOrderSchema), createOrder)

module.exports = router