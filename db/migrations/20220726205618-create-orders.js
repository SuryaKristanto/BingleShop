module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      order_no: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_price: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        type: Sequelize.DATE,
        default: new Date(),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        default: new Date(),
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  },
};
