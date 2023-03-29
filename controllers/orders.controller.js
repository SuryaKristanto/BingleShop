const { Op } = require("sequelize");
const { Items, sequelize, Orders, OrderItems, Users } = require("../db/models");
const uuid = require("uuid");

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

    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const order_no = parseInt(`${timestamp}${random}`);

    await sequelize.transaction(async (trx) => {
      // create order dan
      const order = await Orders.create(
        {
          user_id: req.user_id,
          order_no: order_no,
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

const updateStatus = async (req, res, next) => {
  try {
    const order = req.body;
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

const getOrders = async (req, res, next) => {
  try {
    const userId = await Users.findByPk(req.user_id);
    const orders = await Orders.findAll({
      where: { user_id: userId.id },
      attributes: ["order_no", "status", "total_price"],
      include: [
        {
          model: OrderItems,
          as: "order_items",
          include: [
            {
              model: Items,
              as: "item",
              attributes: ["name", "price"],
            },
          ],
          attributes: {
            exclude: ["id", "order_id", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });

    const orderItem = [];
    orders.map((order) => {
      const items = order.order_items;
      const allItem = [];
      items.map((item) => {
        allItem.push({
          item_id: item.item_id,
          qty_order: item.qty_order,
          name: item.item.name,
          price: item.item.price,
        });
      });
      orderItem.push({
        order_no: order.order_no,
        status: order.status,
        total_price: order.total_price,
        items: allItem,
      });
    });

    if (orders.length === 0) {
      throw {
        code: 404,
        message: "order not found",
      };
    }

    return res.status(200).json({
      message: "success show all order",
      data: orderItem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Orders.findOne({
      where: {
        id: req.params.idorder,
        user_id: req.user_id,
        status: "pending",
      },
    });
    if (!order) {
      throw { code: 404, message: "order not found" };
    }
    await OrderItems.destroy({ where: { order_id: order.id } });
    order.destroy();
    res.status(200).json({
      message: "success remove order",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  updateStatus,
  getOrders,
  deleteOrder,
};
