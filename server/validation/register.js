const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateRegisterInput(data) {
  data.name = validText(data.username) ? data.username : "";
  data.email = validText(data.email) ? data.email : "";
  data.password = validText(data.password) ? data.password : "";

  if (Validator.isEmpty(data.username)) {
    return { message: "Username field is required", isValid: false };
  }

  if (!Validator.isEmail(data.email)) {
    return { message: "Email is invalid", isValid: false };
  }

  if (Validator.isEmpty(data.email)) {
    return { message: "Email field is required", isValid: false };
  }

  if (Validator.isEmpty(data.password)) {
    return { message: "Password field is required", isValid: false };
  }

  if (!Validator.isLength(data.password, { min: 6, max: 32 })) {
    return { message: "Password length must be between 6 and 32 characters.", isValid: false }
  }

  return {
    message: "",
    isValid: true
  };
};