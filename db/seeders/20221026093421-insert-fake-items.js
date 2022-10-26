const { generateFakeItem } = require("../../utils/helper");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("items", generateFakeItem(10), {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("items", null, {});
  },
};
