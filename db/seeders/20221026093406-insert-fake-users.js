const { generateFakeUser } = require("../../utils/helper");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("users", generateFakeUser(10), {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
