const { createItem, getItem } = require("../controllers/items.controller");

const {
  roleAuthorization,
} = require("../middlewares/authorization.middleware");

const validation = require("../middlewares/validation.middleware");

const createItemSchema = require("../validations/create-item.schema");

const router = require("express").Router();

router.post(
  "/create-item",
  roleAuthorization("admin", "member"),
  validation(createItemSchema),
  createItem
);
router.get("/get-item", getItem);

module.exports = router;
