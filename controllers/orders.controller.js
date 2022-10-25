const { Op } = require("sequelize");
const { Items, sequelize, Orders, OrderItems } = require("../db/models");

const createOrder = async (req, res, next) => {
  try {
    // cek itemnya ada semua ngga?
    const { items } = req.body;

    const itemIds = items.map((item) => {
      return item.item_id;
    });

    const existItems = await Items.findAll({
      where: {
        id: {
          [Op.in]: itemIds,
        },
      },
    });
    console.log(existItems);
    if (existItems.length !== items.length) {
      throw {
        code: 404,
        message: "item not found",
      };
    }

    await sequelize.transaction(async (trx) => {
      // create order dan
      const order = await Orders.create(
        {
          user_id: req.user_id,
          order_no: Math.floor(Math.random() * 100 + 1),
          status: "pending",
        },
        {
          transaction: trx,
        }
      );
      const totalPrice = [];
      await Promise.all(
        existItems.map(async (item) => {
          const selectedPayload = items.find((val) => val.item_id === item.id);

          // deduct qty item
          await Items.update(
            {
              qty: item.qty - selectedPayload.qty,
            },
            {
              where: {
                qty: item.qty,
              },
              transaction: trx,
            }
          );

          // create order item
          const orderItems = await OrderItems.create(
            {
              item_id: item.id,
              order_id: order.id,
              qty_order: selectedPayload.qty,
            },
            {
              transaction: trx,
            }
          );
          const totalPerItem = selectedPayload.qty * item.price;
          totalPrice.push(totalPerItem);
        })
      );
      var sum = 0;
      for (let i = 0; i < totalPrice.length; i++) {
        sum += totalPrice[i];
      }
      console.log(totalPrice);
      console.log(sum);
      // update total price
      await order.update(
        {
          total_price: sum,
        },
        {
          transaction: trx,
        }
      );
    });

    // send response
    return res.status(201).json({
      message: "success create order",
    });
  } catch (error) {
    next(error);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const order = req.body.orders[0];
    const existOrder = await Orders.findOne({
      where: { id: order.order_id },
    });
    if (!existOrder) {
      throw {
        code: 404,
        message: "order not found",
      };
    }
    await existOrder.update({
      status: order.status,
    });

    return res.status(302).json({
      code: 302,
      message: "payment successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  updatePayment,
};
