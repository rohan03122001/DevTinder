const validator = require("validator");

const ValidateSignUpData = (req) => {
  //take out all fields

  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || lastName.length > 50) {
    throw new Error("firstName should be between 4 to 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Weak Password");
  }
};

const ValidateProfileEditData = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photoURL",
    "skills",
  ];

  const isValidData = Object.keys(req.body).every((field) =>
    allowedUpdates.includes(field)
  );

  return isValidData;
};

const ValidatePassword = (req) => {
  const allowedUpdate = ["password"];
  console.log(req.body.password);
  const isValidPassword = Object.keys(req.body).every((field) =>
    allowedUpdate.includes(field)
  );
  return isValidPassword && validator.isStrongPassword(req.body.password);
};

module.exports = {
  ValidateSignUpData,
  ValidateProfileEditData,
  ValidatePassword,
};
