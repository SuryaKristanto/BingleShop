const {
  createItem,
  getItem,
  deleteItem,
  updateItem,
} = require("../controllers/items.controller");

const {
  roleAuthorization,
} = require("../middlewares/authorization.middleware");

const validation = require("../middlewares/validation.middleware");

var cacheService = require("express-api-cache");
var cache = cacheService.cache;

const createItemSchema = require("../validations/create-item.schema");
const updateItemSchema = require("../validations/update-item.schema");

const router = require("express").Router();

router.post(
  "/add",
  roleAuthorization("admin"),
  validation(createItemSchema),
  createItem
);
router.get("/", cache("5 minutes"), getItem);
router.delete("/delete/:iditem", roleAuthorization("admin"), deleteItem);
router.patch(
  "/update/:iditem",
  validation(updateItemSchema),
  roleAuthorization("admin"),
  updateItem
);
router.put(
  "/update/:iditem",
  validation(updateItemSchema),
  roleAuthorization("admin"),
  updateItem
);

module.exports = router;
