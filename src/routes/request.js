const express = require("express");

const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendconnection", userAuth, async (req, res) => {
  try {
    res.send("Sent Request");
  } catch (error) {
    res.status(400).send("Error while dsending request " + error);
  }
});

module.exports = requestRouter;
