const express = require("express");

const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { ValidateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validate
    ValidateSignUpData(req);

    //password

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();
    res.send("User Created Successfully");
  } catch (err) {
    res.status(400).send("Error While Creating user " + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log(emailId, password);

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("unable to login check credentials");
    }
    console.log(user);
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = await jwt.sign({ _id: user._id }, "MySecret@0312");

      res.cookie("token", token);

      res.send("Login Successs");
    } else {
      throw new Error("unable to login check credentials");
    }
  } catch (error) {
    res.status(400).send("Error while log in " + error);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log(user);
    res.send("profile for " + user);
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});
app.patch("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, req.body);
    res.send("user updated: " + user);
  } catch (error) {
    res.status(400).send("Error while updating user " + error);
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body._id);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error while deleting user " + error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error while fetching users " + err);
  }
});

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
