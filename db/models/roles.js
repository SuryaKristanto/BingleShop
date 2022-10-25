const Sequelize = require("sequelize");
const sequelize = require("./sequelize");

class Roles extends Sequelize.Model {}

Roles.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.DataTypes.ENUM,
      values: ["Active", "Nonactive"],
    },
  },
  {
    sequelize: sequelize,
    timestamp: true,
    underscored: true,
    // paranoid: true,
    freezeTableName: true,
    tableName: "roles",
  }
);

module.exports = Roles;
