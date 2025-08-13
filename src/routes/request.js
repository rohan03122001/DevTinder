const express = require("express");

const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserID",
  userAuth,
  async (req, res) => {
    try {
      const fromUserID = req.user._id;
      const toUserID = req.params.toUserID;
      const status = req.params.status;

      //validation

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "invalid Status: " + status });
      }

      const userExists = await ConnectionRequestModel.findOne({
        fromUserID,
        toUserID,
      });
      if (userExists) {
        return res.status(400).send("Requrest already there");
      }

      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserID,
            toUserID,
          },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });

      if (existingRequest) {
        return res.status(400).send("Request already exist");
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserID,
        toUserID,
        status,
      });

      const data = await connectionRequest.save();

      // res.status(200).send(data);
      res.json({
        message: req.user.firstName + " updated status " + status,
        data,
      });
    } catch (error) {
      res.status(400).send("Error while sending requests " + error);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestID",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const { status, requestID } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid Status");
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestID,
        toUserID: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).send("Invalid Connection Request");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: "connection updated: " + status, data });
    } catch (error) {
      res.status(400).send("Error " + error);
    }
  }
);
module.exports = requestRouter;
