const {
  register,
  login,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/users");
const {
  roleAuthorization,
} = require("../middlewares/authorization.middleware");
const validation = require("../middlewares/validation.middleware");

const registerSchema = require("../validations/register.schema");
const loginSchema = require("../validations/login.schema");
const updateUserSchema = require("../validations/update-user.schema");

const router = require("express").Router();

router.post("/register", validation(registerSchema), register);
router.post("/login", validation(loginSchema), login);
router.get("/profile", getUser);
router.delete("/delete/:id", roleAuthorization("admin"), deleteUser);
router.patch("/profile/update", validation(updateUserSchema), updateUser);

module.exports = router;
