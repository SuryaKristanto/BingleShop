require("dotenv").config();

const jwt = require("jsonwebtoken");

const roleAuthorization = (role) => (req, res, next) => {
  try {
    // get token from header
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1]; // ['Bearer', '<token>']

    // verify token using jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // cek apakah role yang akses sudah sesuai
    if (decoded.role !== role) {
      throw {
        code: 403,
        message: "roles are not allowed",
      };
    }

    // inject context
    req.user_id = decoded.user_id;
    req.role = decoded.role;

    // inject context
    req.user_id = decoded.user_id;

    next();
  } catch (error) {
    next({
      code: error.code || 401,
      message: error.message || "invalid token",
    });
  }
};

module.exports = {
  roleAuthorization,
};
