require("dotenv").config();

const { Users } = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const bodies = req.body;

    const [isRoleExist, isUserExist] = await Promise.all([
      Roles.findOne({
        where: {
          id: bodies.role_id,
        },
        attributes: ["id", "name"],
      }),
      Users.findOne({
        where: {
          email: bodies.email,
        },
        attributes: ["id"],
      }),
    ]);

    // cek apakah role_id nya ada atau tidak
    if (!isRoleExist) {
      throw {
        code: 404,
        message: "role not found",
      };
    }

    // cek apakah ada user yang memiliki email yang sudah di register
    // if user exist, send error message
    if (isUserExist) {
      throw {
        code: 400,
        message: "email already exist",
      };
    }

    // hash pw karna secret
    const hasedPassword = bcrypt.hashSync(bodies.password, 12);

    const user = await Users.create({
      role_id: bodies.role_id,
      email: bodies.email,
      password: hasedPassword,
      name: bodies.name,
      address: bodies.address,
      phone: bodies.phone,
    });

    return res.status(200).json({
      code: 201,
      message: "success create user",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // cek email tersebut ada ngga di db
    const user = await Users.findOne({
      where: {
        email,
      },
      attributes: ["id", "password"],
    });

    // kalo gaada email, throw error user not found
    if (!user) {
      throw {
        code: 404,
        message: "user not found",
      };
    }

    // kalo ada kita compare pw
    const isValidPassword = await bcrypt.compare(password, user.password);

    // kalo pwnya beda, throw invalid pw
    if (!isValidPassword) {
      throw {
        code: 401,
        message: "invalid password",
      };
    }

    // kalo pwnya sama, generate token
    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // kirim token di respon
    return res.status(200).json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const profile = await Users.findByPk(req.user_id, {
      attributes: ["email", "name", "address", "phone"],
    });
    res.status(200).json({
      code: 200,
      data: profile,
      message: "success retrieving user",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id == req.user_id) {
      return res
        .status(403)
        .json({ message: "cannot delete actively in used user" });
    }
    const findUser = await Users.findByPk(id);
    if (!findUser) return res.status(404).json({ message: "user not found" });
    await Users.destroy({ where: { id } });
    res.status(200).json({
      message: "success delete user",
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const bodies = req.body;
    await Users.update(bodies, { where: { id: req.user_id } });
    res.status(200).json({
      message: "success Update User",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getUser,
  deleteUser,
  updateUser,
};
