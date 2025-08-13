const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

const SAFE_DATA = ["firstName", "lastName", "skills", "about"];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserID: loggedInUser._id,
      status: "interested",
    }).populate("fromUserID", SAFE_DATA);

    res.json({ message: "Data sent Success", connectionRequests });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserID: loggedInUser._id, status: "accepted" },
        { fromUserID: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserID toUserID", SAFE_DATA);

    res.json({ message: "Data sent Success", connections });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

module.exports = { userRouter };
