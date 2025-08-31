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
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log(user);
    const isValidPassword = await user.isPasswordValid(password);

    if (isValidPassword) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });

      res.json({ message: "Login Success" });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).send("Error while log in " + error);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send();
});

module.exports = authRouter;
