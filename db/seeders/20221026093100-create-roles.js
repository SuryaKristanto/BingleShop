module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: 1,
          name: "admin",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "member",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: "guest",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
