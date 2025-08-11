const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const {
  ValidateProfileEditData,
  ValidatePassword,
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log(user);
    res.send("profile for " + user);
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!ValidateProfileEditData(req)) {
      throw new Error("invalid Data");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: "Profile is Updated",
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!ValidatePassword(req)) {
      throw new Error("invalid Password");
    }

    const loggedInUser = req.user;
    loggedInUser.password = await bcrypt.hash(req.body.password, 10);

    await loggedInUser.save();

    res.json({ message: "Password Updated", data: loggedInUser });
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});

module.exports = profileRouter;
