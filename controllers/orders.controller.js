const { Op } = require('sequelize')
const {Items, sequelize, Orders, OrderItems, Users} = require('../db/models')

const createOrder = async(req, res, next) => {
    try {
        // cek itemnya ada semua ngga?
        const {items} = req.body

        const itemIds = items.map(item => {
            return item.item_id
        })

        const existItems = await Items.findAll({
            where: {
                id: {
                    [Op.in]: itemIds
                },
            }
        })

        if (existItems.length !== items.length) {
            throw {
                code: 400,
                message: 'ada item yang tidak ditemukan'
            }
        }
        
        await sequelize.transaction(async trx => {
            // create order dan 
            const order = await Orders.create({
                user_id: 1,
                order_no: Math.floor((Math.random() * 100) + 1),
                status: 'Menunggu Pembayaran',
            }, {
                transaction: trx
            })

            await Promise.all(
                existItems.map(async item => {
                    const selectedPayload = items.find(val => val.item_id === item.id)
    
                    // deduct stok item
                    await Items.update({
                        qty: item.qty - selectedPayload.qty
                    }, {
                        where: {
                            qty: item.qty
                        },
                        transaction: trx 
                    })
    
                    // create order item
                    await OrderItems.create({
                        item_id: item.id,
                        order_id: order.id,
                        qty_order: selectedPayload.qty
                    }, {
                        transaction: trx
                    })
                })
            )
        })

        // send response
        return res.status(200).json({
            message: 'success membuat order'
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createOrder
}