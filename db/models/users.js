const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

class Users extends Sequelize.Model {}

Users.init({
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    email: {
        type: Sequelize.DataTypes.STRING
    },
    password: {
        type: Sequelize.DataTypes.STRING
    },
    name: {
        type: Sequelize.DataTypes.STRING
    },
    address: {
        type: Sequelize.DataTypes.TEXT
    },
    phone: {
        type: Sequelize.DataTypes.STRING
    },
}, {
    sequelize: sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'users'
})

module.exports = Users