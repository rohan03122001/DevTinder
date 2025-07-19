const express = require("express");

const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.patch("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, req.body);
    res.send("user updated: " + user);
  } catch (error) {
    res.status(400).send("Error while updating user " + error);
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body._id);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Error while deleting user " + error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error while fetching users " + err);
  }
});

app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);

  try {
    await newUser.save();
    res.send("User Created Successfully");
  } catch (err) {
    res.status(400).send("Error While Creating user " + err);
  }
});

connectDB()
  .then(() => {
    console.log("Connection to DB successful");
    app.listen(3000, () => {
      console.log("Server Running on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB Connection Error" + err);
  });
