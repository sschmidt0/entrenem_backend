const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateRegisterInput = (data) => {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.userName = !isEmpty(data.userName) ? data.userName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Name checks
  if (Validator.isEmpty(data.userName)) {
    errors.userName = "Introdueix un nom d'usuari o el teu nom"
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "El correu electrònic és obligatori";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "El correu electrònic no és vàlid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "La paraula de pas és obligatòria";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 12 })) {
    errors.password = "La paraula de pas ha de tenir entre 6 i 12 caràcters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
