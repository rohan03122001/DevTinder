const express = require("express");

const app = express();

const connectDB = require("./config/database");
// const User = require("./models/user");

// const bcrypt = require("bcrypt");
// const { ValidateSignUpData } = require("./utils/validation");
// const jwt = require("jsonwebtoken");
// const { userAuth } = require("./middlewares/auth");

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const { userRouter } = require("./routes/users");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Connection to DB successful");
    app.listen(3000, () => {
      console.log("Server Running on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB Connection Error" + err);
  });
