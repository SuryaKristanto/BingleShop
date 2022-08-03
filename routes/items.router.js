const { createItem, getItem } = require('../controllers/items.controller')

const validation = require('../middlewares/validation.middleware')

const createItemSchema = require('../validations/create-item.schema')

const router = require('express').Router()

router.post('/create-item', validation(createItemSchema), createItem)
router.get('/get-item', getItem)

module.exports = router