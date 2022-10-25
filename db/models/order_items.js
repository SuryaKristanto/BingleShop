const Sequelize = require("sequelize");
const sequelize = require("./sequelize");

class OrderItems extends Sequelize.Model {}

OrderItems.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    item_id: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: "items",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    order_id: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: "orders",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    qty_order: {
      type: Sequelize.DataTypes.INTEGER,
    },
  },
  {
    sequelize: sequelize,
    timestamps: true,
    underscored: true,
    // paranoid: true,
    freezeTableName: true,
    tableName: "order_items",
  }
);

module.exports = OrderItems;
