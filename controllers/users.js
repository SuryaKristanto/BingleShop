require("dotenv").config();

const { Users } = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const bodies = req.body;

    const isUserExist = await Users.findOne({
      where: {
        email: bodies.email,
      },
      attributes: ["id"],
    });

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
        code: 403,
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

module.exports = {
  register,
  login,
};
