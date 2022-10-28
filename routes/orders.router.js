const {
  createOrder,
  updateStatus,
  getOrders,
  deleteOrder,
} = require("../controllers/orders.controller");

const {
  roleAuthorization,
} = require("../middlewares/authorization.middleware");

const validation = require("../middlewares/validation.middleware");

var cacheService = require("express-api-cache");
var cache = cacheService.cache;

const createOrderSchema = require("../validations/create-order.schema");

const router = require("express").Router();

router.post(
  "/",
  roleAuthorization("admin", "member"),
  validation(createOrderSchema),
  createOrder
);
router.post("/payment", roleAuthorization("admin"), updateStatus);
router.get(
  "/",
  roleAuthorization("admin", "member"),
  cache("5 minutes"),
  getOrders
);
router.delete(
  "/delete/:idorder",
  roleAuthorization("admin", "member"),
  deleteOrder
);

module.exports = router;
