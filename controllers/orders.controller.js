const { Op } = require('sequelize')
const {Items, sequelize, Orders, OrderItems} = require('../db/models')

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
                }
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
                user_id: req.user_id,
                order_no: Math.floor((Math.random() * 100) + 1),
                status: 'Menunggu Pembayaran',
            }, {
                transaction: trx
            })

            await Promise.all(
                existItems.map(async item => {
                    const selectedPayload = items.find(val => val.item_id === item.id)
    
                    // deduct qty item
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

                    // update total price
                    await Orders.update({
                        total_price: selectedPayload.qty * item.price
                    }, {
                        where: {
                            
                        },
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

const updatePayment = async(req, res, next) => {
    try {
        const bodies = req.body

        const existOrder = await Orders.findAll({
            where: {
                user_id: req.user_id,
                status: 'Menunggu Pembayaran'
            },
        })
        if (existOrder.length < 1) {
            throw {
                code: 400,
                message: "Tidak ada order"
            }
        }
        await Orders.update({
            status: 'Sedang Diproses'
        }, {
            where: {
                user_id: req.user_id
            }
        })

        return res.status(302).json({
            code: 302,
            message: 'Pembayaran Berhasil',

        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createOrder,
    updatePayment
}