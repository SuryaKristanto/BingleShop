const Sequelize = require('sequelize')
const sequelize = require('./sequelize')

class Items extends Sequelize.Model {}

Items.init({
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    user_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    name: {
        type: Sequelize.DataTypes.STRING
    },
    price: {
        type: Sequelize.DataTypes.INTEGER
    },
    weight: {
        type: Sequelize.DataTypes.INTEGER
    },
    qty: {
        type: Sequelize.DataTypes.INTEGER
    },
}, {
    sequelize: sequelize,
    timestamps: true,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'items'
})

module.exports = Items