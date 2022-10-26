const {
  createOrder,
  updatePayment,
} = require("../controllers/orders.controller");

const {
  roleAuthorization,
} = require("../middlewares/authorization.middleware");

const validation = require("../middlewares/validation.middleware");

const createOrderSchema = require("../validations/create-order.schema");

const router = require("express").Router();

router.post(
  "",
  roleAuthorization("admin", "member"),
  validation(createOrderSchema),
  createOrder
);
router.post("/payment", roleAuthorization("admin"), updatePayment);

module.exports = router;
