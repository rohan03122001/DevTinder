const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log(user);
    res.send("profile for " + user);
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});

module.exports = profileRouter;
