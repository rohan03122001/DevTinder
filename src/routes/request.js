const express = require("express");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/send/:status/:userID", userAuth, async (req, res) => {
  try {
    const { status, userID } = req.params;
    if (!["ignored", "interested"].includes(status)) {
      return res.status(400).send("invalid Status: " + status);
    }
    const exists = await ConnectionRequest.findOne({
      fromUserID: req.user._id,
      toUserID: userID,
    });
    if (exists) return res.status(409).json({ message: "Request already exists" });

    const data = await ConnectionRequest.create({
      fromUserID: req.user._id,
      toUserID: userID,
      status,
    });

    res.json({ message: `${req.user.firstName} updated status ${status}`, data });
  } catch (e) {
    res.status(400).send("Error " + e);
  }
});

requestRouter.post("/review/:status/:requestID", userAuth, async (req, res) => {
  try {
    const { status, requestID } = req.params;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).send("invalid Status: " + status);
    }
    const reqDoc = await ConnectionRequest.findOne({ _id: requestID, toUserID: req.user._id });
    if (!reqDoc || reqDoc.status !== "interested") {
      return res.status(400).send("invalid request");
    }
    reqDoc.status = status;
    const data = await reqDoc.save();
    res.json({ message: "Connection updated: " + status, data });
  } catch (e) {
    res.status(400).send("Error " + e);
  }
});

requestRouter.get("/received", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ toUserID: req.user._id, status: "interested" })
      .populate("fromUserID", "firstName lastName skills about photoURL emailId");
    res.json({ message: "Data sent Success", connectionRequests: requests });
  } catch (e) {
    res.status(400).send("Error " + e);
  }
});

module.exports = requestRouter;