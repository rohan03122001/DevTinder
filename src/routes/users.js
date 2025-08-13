const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserID: loggedInUser._id,
      status: "interested",
    }).populate("fromUserID", ["firstName", "lastName", "skills", "about"]);

    res.json({ message: "Data sent Success", connectionRequests });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

module.exports = { userRouter };
