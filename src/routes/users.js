const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

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
    })
      .populate("fromUserID", SAFE_DATA)
      .populate("toUserID", SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserID.toString() === loggedInUser._id.toString()) {
        return row.toUserID;
      }
      return row.fromUserID;
    });

    res.json({ message: "Data sent Success", data });
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
    }).select("fromUserID toUserID");

    const hideUserFromFeed = new Set();
    connections.forEach((req) => {
      hideUserFromFeed.add(req.fromUserID.toString());
      hideUserFromFeed.add(req.toUserID.toString());
    });
    console.log(hideUserFromFeed);

    const data = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(SAFE_DATA);

    res.send(data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

module.exports = { userRouter };
