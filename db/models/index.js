const sequelize = require('./sequelize')
const Users = require('./users')
const Items = require('./items')
const Orders = require('./orders')
const OrderItems = require('./order_items')

Items.belongsTo(Users, {
  as: 'user',
  foreignKey: 'user_id'
})

Users.hasMany(Items, {
  as: 'items',
  foreignKey: 'user_id'
})

Orders.belongsTo(Users, {
  as: 'user',
  foreignKey: 'user_id'
})

Users.hasMany(Orders, {
  as: 'orders',
  foreignKey: 'user_id'
})

OrderItems.belongsTo(Orders, {
  as: 'order',
  foreignKey: 'order_id'
})

Orders.hasMany(OrderItems, {
  as: 'order_items',
  foreignKey: 'order_id'
})

OrderItems.belongsTo(Items, {
  as: 'item',
  foreignKey: 'item_id'
})

Items.hasMany(OrderItems, {
  as: 'order_items',
  foreignKey: 'item_id'
})

module.exports = {
  sequelize,
  Users,
  Items,
  Orders,
  OrderItems
}