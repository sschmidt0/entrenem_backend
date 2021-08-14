const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateUpdatedUserInput (data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.userName = !isEmpty(data.userName) ? data.userName : "";

  // Checks if fields are empty
  if (Validator.isEmpty(data.userName)) errors.userName = "Afegeix un nom d'usuari";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
