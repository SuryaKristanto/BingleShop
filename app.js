const express = require("express");

const app = express();

// router
const userRouter = require("./routes/users.router");
const itemRouter = require("./routes/items.router");
const orderRouter = require("./routes/orders.router");

// logger
const logger = require("./middlewares/errorhandler.middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/auth", userRouter);
app.use("/items", itemRouter);
app.use("/orders", orderRouter);

// error handler for unknown endpoint
app.use("*", (req, res, next) => {
  return res.status(404).json({
    message: "endpoint not found",
  });
});

// error handler for unexpected error
app.use((err, req, res, next) => {
  logger.error(JSON.stringify(err));
  const status = err.code || 500;
  const message = err.message || "internal server error";

  return res.status(status).json({
    message,
  });
});

module.exports = app;
