const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://RohanBhujbal:Rohan%4003122001@devtinder.8znqlx7.mongodb.net/?retryWrites=true&w=majority&appName=devTinder/devTinder"
  );
};

module.exports = connectDB;
