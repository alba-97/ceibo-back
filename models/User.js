const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const {
  isEmail,
  isMobilePhone,
  isURL,
  isStrongPassword,
} = require("validator");

const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: (str) =>
      isStrongPassword(str, {
        minLength: 8,
        minUppercase: 1,
        minSymbols: 0,
        minNumbers: 0,
        returnScore: false,
      }),
  },
  salt: {
    type: String,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: isEmail,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: isMobilePhone,
  },
  profile_img: {
    type: String,
    validate: isURL,
  },
});

User.methods.validatePassword = function (password) {
  return bcrypt
    .hash(password, this.salt)
    .then((hash) => hash === this.password);
};

User.pre("save", function () {
  const salt = bcrypt.genSaltSync(8);
  this.salt = salt;
  return bcrypt.hash(this.password, this.salt).then((hash) => {
    this.password = hash;
  });
});

module.exports = mongoose.model("User", User);
