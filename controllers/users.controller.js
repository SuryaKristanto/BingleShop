require("dotenv").config();

const { Users } = require("../db/models");
const { Roles } = require("../db/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const extend = require("util")._extend;
const JsonFind = require("json-find");
const connection = require("../db");
const moment = require("moment");
const today = moment();

async function queryDB(query, param) {
  return new Promise((resolve) => {
    connection.query(query, param, function (err, result, fields) {
      if (err) {
        //resolve('err : ' + err.stack);
        resolve("err :" + err.message);
      } else {
        resolve(result);
      }
    });
  });
}

const register = async (req, res, next) => {
  try {
    const bodies = req.body;
    var isRoleExist = await queryDB(
      `SELECT * FROM roles WHERE id = ${bodies.role_id}`
    );
    var isUserExist = await queryDB(
      `SELECT email FROM  users WHERE email = "${bodies.email}"`
    );

    // const [isRoleExist, isUserExist] = await Promise.all([
    //   Roles.findOne({
    //     where: {
    //       id: bodies.role_id,
    //     },
    //     attributes: ["id", "name"],
    //   }),
    //   Users.findOne({
    //     where: {
    //       email: bodies.email,
    //     },
    //     attributes: ["id"],
    //   }),
    // ]);

    // cek apakah role_id nya ada atau tidak
    if (isRoleExist.length < 1) {
      throw {
        code: 404,
        message: "role not found",
      };
    }

    console.log(isRoleExist);

    // cek apakah ada user yang memiliki email yang sudah di register
    // if user exist, send error message
    if (!isUserExist.length < 1) {
      throw {
        code: 400,
        message: "email already exist",
      };
    }

    // hash pw karna secret (encrypt)
    // Hmac
    const encrypted = crypto
      .createHmac("sha256", process.env.SECRET)
      .update(bodies.password)
      .digest("hex");

    // Cipher
    // const cipher = crypto.createCipher("aes-192-cbc", process.env.SECRET);
    // var encrypted = cipher.update(bodies.password, "utf-8", "hex");
    // encrypted += cipher.final("hex");
    // console.log(encrypted);

    // decrypt
    // const decipher = crypto.createDecipher("aes-192-cbc", process.env.SECRET);
    // var decrypted = decipher.update(encrypted, "hex", "utf-8");
    // decrypted += decipher.final("utf-8");
    // console.log(decrypted);

    var data = {};

    let InputData = {
      role_id: bodies.role_id,
      email: bodies.email,
      password: bodies.password,
      name: bodies.name,
      address: bodies.address,
      phone: bodies.phone,
    };
    console.log("InputData");
    console.log(InputData);
    console.log("------------------------------");

    data = extend({}, InputData);
    console.log("data");
    console.log(data);
    console.log("------------------------------");

    // Get Keys
    var keys = Object.keys(data);
    console.log("keys");
    console.log(keys);
    // Delete Data yang tidak perlu di enkripsi
    keys.splice(keys.indexOf("role_id"), 1);
    console.log("------------------------------");

    // Check ada kosong tidak array nya
    console.log("Sebelum sort");
    Object.entries(data).forEach(([key, value]) =>
      console.log(`${key} : ${value}`)
    ); // Tampilan json type
    console.log("------------------------------");

    console.log("Sesudah Sort");
    keys.sort(); // Sort Keys
    console.log(keys);
    console.log("------------------------------");

    console.log("urutan");
    for (var i = 0; i < keys.length; i++) {
      console.log(i + " : " + keys[i]);
    }
    console.log("------------------------------");

    // Output
    let output;
    var docData = JsonFind(data);
    // console.log('Data value di temukan : ' + docData.checkKey(keys[2]));
    // console.log('Data ini telah di pilih :   ' + docData.checkKey(keys[1]));
    output = "";

    for (var i = 0; i < keys.length; i++) {
      if (Array.isArray(docData.checkKey(keys[i]))) {
        //Array
        //output = output + JSON.stringify(docData.checkKey(keys[i])).toUpperCase() + '%';
        output = output + JSON.stringify(docData.checkKey(keys[i])) + "%";
      } else {
        //not Array
        //output = output + docData.checkKey(keys[i]).toUpperCase() + '%';
        output = output + docData.checkKey(keys[i]) + "%";
      }
    }

    var password = "abcdefg";

    output += password;
    output = output.toUpperCase();
    console.log("Hasil Output");
    console.log(output);
    console.log("------------------------------");

    // Enkripsi SHA256 Hash
    // const secret = 'hijkl';
    // const hash = crypto
    //   .createHmac("sha256", secret)
    //   .update(output)
    //   .digest("hex");
    var hash = crypto.createHash("sha256").update(output).digest("hex");
    console.log("Hasil Enkripsi");
    var upperCaseHash = hash.toUpperCase();
    console.log(upperCaseHash);
    var stringHash = JSON.stringify(upperCaseHash);
    console.log(stringHash);

    InputData.password = encrypted;
    // const user = await Users.create(InputData);
    var user = await queryDB(
      `INSERT INTO users (id,role_id,email,password,name,address,phone,created_at,updated_at) VALUES (DEFAULT,?,?,?,?,?,?,?,?)`,
      [
        InputData.role_id,
        InputData.email,
        InputData.password,
        InputData.name,
        InputData.address,
        InputData.phone,
        today.format("YYYY-MM-DD hh:mm:ss"),
        today.format("YYYY-MM-DD hh:mm:ss"),
      ]
    );

    console.log(user);

    return res.status(200).json({
      code: 201,
      message: "success create user",
      data: {
        name: InputData.name,
        email: InputData.email,
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
      attributes: ["id", "role_id", "password"],
      include: [
        {
          model: Roles,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });

    // kalo gaada email, throw error user not found
    if (!user) {
      throw {
        code: 404,
        message: "user not found",
      };
    }

    // kalo ada kita compare pw
    const hasedPassword = await crypto
      .createHmac("sha256", process.env.SECRET)
      .update(password)
      .digest("hex");
    const isValidPassword = hasedPassword === user.password;

    // kalo pwnya beda, throw invalid pw
    if (!isValidPassword) {
      throw {
        code: 401,
        message: "invalid password",
      };
    }

    // kalo pwnya sama, generate token
    const token = jwt.sign(
      { user_id: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // kirim token di respon
    return res.status(200).json({
      code: 200,
      message: "login succesful",
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
      message: "success update user",
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
