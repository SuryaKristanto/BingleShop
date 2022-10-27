const sequelize = require("sequelize");
const { Items } = require("../db/models");

const createItem = async (req, res, next) => {
  try {
    const bodies = req.body;

    const item = await Items.create({
      user_id: req.user_id,
      name: bodies.name,
      price: bodies.price,
      weight: bodies.weight,
      qty: bodies.qty,
    });

    return res.status(201).json({
      message: "success create item",
    });
  } catch (error) {
    next(error);
  }
};

const getItem = async (req, res, next) => {
  try {
    const items = await Items.findAll({
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt", "deletedAt"],
      },
    });
    const isItemExist = items && items.length > 0;

    if (!isItemExist) {
      // kalo ngga ada data, maka return status code 404
      return res.status(404).json({
        message: "item not found",
      });
    } else {
      // kalo ada data, return datanya
      return res.status(200).json({
        message: "success get item",
        data: items,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { iditem } = req.params;
    const findItem = await Items.findByPk(iditem);
    if (!findItem)
      return res.status(404).json({
        message: "item not found",
      });
    await Items.destroy({ where: { id: iditem } });
    res.status(200).json({
      message: "success remove items",
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await Items.findByPk(req.params.iditem);
    if (!item) {
      return res.status(404).json({
        message: "item not found",
      });
    }
    const bodies = req.body;
    await Items.update(bodies, { where: { id: req.user_id } });
    res.status(200).json({
      message: "success update item",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItem,
  getItem,
  deleteItem,
  updateItem,
};
