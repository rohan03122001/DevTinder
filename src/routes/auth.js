const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // adjust if your path differs
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(201).json({ message: "Signup Success" });
  } catch (error) {
    res.status(400).send("Error While Creating user " + error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const token = await user.getJWT({ expiresIn: "8h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 8 * 3600000
    });
    res.json({ message: "Login Success" });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0)
  });
  res.json({ message: "Logout Success" });
});

module.exports = authRouter;
