const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const decodedObj = jwt.verify(token, "MySecret@0312");

    const user = await User.findById(decodedObj._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error " + err);
  }
};

module.exports = {
  userAuth,
};
