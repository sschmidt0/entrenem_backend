const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateActivityInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.message = !isEmpty(data.message) ? data.message : "";
  data.writtenBy = !isEmpty(data.writtenBy) ? data.writtenBy : "";
  data.writtenByName = !isEmpty(data.writtenByName) ? data.writtenByName : "";
  data.activityID = !isEmpty(data.activityID) ? data.activityID : "";

  // Checks if fields are empty
  if (Validator.isEmpty(data.message)) errors.message = "Afegeix un comentari";
  if (Validator.isEmpty(data.writtenBy)) errors.writtenBy = "Falta la ID de l'usuari";
  if (Validator.isEmpty(data.writtenByName)) errors.writtenByName = "Falta el nom de l'usuari";
  if (Validator.isEmpty(data.activityID)) errors.activityID = "Falta la ID de l'activitat";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
