const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const generateFakeUser = (qty) => {
  const users = [];

  for (let i = 0; i < qty; i++) {
    users.push({
      role_id: 1,
      email: faker.internet.email().toLowerCase(),
      password: bcrypt.hashSync("admin123", 12),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      address: faker.address.city(),
      phone: faker.phone.number("+628##########"),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  return users;
};

const generateFakeItem = (qty) => {
  const items = [];

  for (let i = 0; i < qty; i++) {
    items.push({
      user_id: faker.datatype.number({ min: 1, max: 10 }),
      name: `${faker.commerce.productName()}`,
      price: faker.commerce.price(1000, 100000, 0),
      weight: faker.datatype.number({ min: 1, max: 100 }),
      qty: faker.datatype.number({ min: 10, max: 100 }),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  return items;
};

module.exports = { generateFakeUser, generateFakeItem };
