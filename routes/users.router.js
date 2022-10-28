const {
  register,
  login,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/users.controller");

const {
  roleAuthorization,
} = require("../middlewares/authorization.middleware");

const validation = require("../middlewares/validation.middleware");

var cacheService = require("express-api-cache");
var cache = cacheService.cache;

const registerSchema = require("../validations/register.schema");
const loginSchema = require("../validations/login.schema");
const updateUserSchema = require("../validations/update-user.schema");

const router = require("express").Router();

router.post("/register", validation(registerSchema), register);
router.post("/login", validation(loginSchema), login);
router.get(
  "/profile",
  roleAuthorization("admin", "member"),
  cache("5 minutes"),
  getUser
);
router.delete("/delete/:id", roleAuthorization("admin"), deleteUser);
router.patch(
  "/profile/update",
  roleAuthorization("admin", "member"),
  validation(updateUserSchema),
  updateUser
);
router.put(
  "/profile/update",
  roleAuthorization("admin", "member"),
  validation(updateUserSchema),
  updateUser
);

module.exports = router;
