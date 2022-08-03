const { createOrder } = require('../controllers/orders.controller')

const validation = require('../middlewares/validation.middleware')

const createOrderSchema = require('../validations/create-order.schema')

const router = require('express').Router()

router.post('/create-order', validation(createOrderSchema), createOrder)

module.exports = router