const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { ValidateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log(emailId, password);

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("unable to login check credentials");
    }
    console.log(user);
    const isValidPassword = await user.isPasswordValid(password);

    if (isValidPassword) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });

      res.send("Login Successs");
    } else {
      throw new Error("unable to login check credentials");
    }
  } catch (error) {
    res.status(400).send("Error while log in " + error);
  }
});

module.exports = authRouter;
