const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const usersRouter = express.Router();

const SAFE = "firstName lastName skills about photoURL";

usersRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const data = await require("./connectionRequest")
      .find({ toUserID: req.user._id, status: "interested" })
      .populate("fromUserID", SAFE);
    res.json({ message: "Data sent Success", connectionRequests: data });
  } catch (e) {
    res.status(400).send("Error " + e);
  }
});

usersRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const ConnectionRequest = require("./connectionRequest");
    const accepted = await ConnectionRequest.find({
      $or: [{ fromUserID: req.user._id }, { toUserID: req.user._id }],
      status: "accepted",
    });

    const ids = accepted.map(r =>
      String(r.fromUserID) === String(req.user._id) ? r.toUserID : r.fromUserID
    );

    const data = await User.find({ _id: { $in: ids } }).select(SAFE);
    res.json({ message: "Data sent Success", data });
  } catch (e) {
    res.status(400).send("Error " + e);
  }
});

usersRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
    const skip = (page - 1) * limit;

    const ConnectionRequest = require("./connectionRequest");
    const requests = await ConnectionRequest.find({
      $or: [{ fromUserID: req.user._id }, { toUserID: req.user._id }],
    });

    const excluded = new Set([
      String(req.user._id),
      ...requests.map(r => String(r.fromUserID)),
      ...requests.map(r => String(r.toUserID)),
    ]);

    const query = { _id: { $nin: Array.from(excluded) } };
    const data = await User.find(query).select(SAFE).limit(limit).skip(skip);
    res.json(data);
  } catch (e) {
    res.status(400).send("Error " + e);
  }
});

module.exports = usersRouter;
