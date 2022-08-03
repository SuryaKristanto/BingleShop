const sequelize = require('sequelize')
const { Items } = require('../db/models')

const createItem = async (req, res, next) => {
    try {
        const bodies = req.body

        const item = await Items.create({
            user_id: bodies.user_id,
            name: bodies.name,
            price: bodies.price,
            weight: bodies.weight,
            qty: bodies.qty
        })

        return res.status(200).json({
            message: 'Success create item',
        })
    } catch (error) {
        next(error)
    }
}

const getItem = async (req, res, next) => {
    try {
        const items = await Items.findAll()
        const isItemExist = items && items.length > 0

        if (!isItemExist) {
            // kalo ngga ada data, maka return status code 404
            return res.status(404).json({
                message: 'item tidak ditemukan'
            })
        } else {
            // kalo ada data, return datanya
            return res.status(200).json({
                message: 'item ditemukan',
                data: items
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createItem,
    getItem
}