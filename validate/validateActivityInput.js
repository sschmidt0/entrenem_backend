const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateActivityInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.category = !isEmpty(data.category) ? data.category : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.dateTime = !isEmpty(data.dateTime) ? data.dateTime : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.createdBy.userId = !isEmpty(data.createdBy.userId) ? data.createdBy.userId : "";
  data.createdBy.userName = !isEmpty(data.createdBy.userName) ? data.createdBy.userName : "";
  data.difficulty = !isEmpty(data.difficulty) ? data.difficulty : "";
  data.location.place = !isEmpty(data.location.place) ? data.location.place : "";
  data.location.longPlace = !isEmpty(data.location.longPlace) ? data.location.longPlace : "";
  data.location.city = !isEmpty(data.location.city) ? data.location.city : "";

  // Checks if fields are empty
  if (Validator.isEmpty(data.category)) errors.category = "Eligeix una categoria";
  if (Validator.isEmpty(data.title)) errors.title = "Escriu un títol";
  if (Validator.isEmpty(data.dateTime)) errors.dateTime = "Eligeix dia i hora";
  if (Validator.isEmpty(data.description)) errors.description = "Afegeix una petita descripció";
  if (Validator.isEmpty(data.createdBy.userId)) errors.createdBy.userId = "Falta la ID de l'usuari";
  if (Validator.isEmpty(data.createdBy.userName)) errors.createdBy.userName = "Falta el nom de l'usuari";
  if (Validator.isEmpty(data.difficulty)) errors.difficulty = "Eligeix un nivell de dificultat";
  if (Validator.isEmpty(data.location.place)) errors.location.place = "Eligeix un punt de trobada";
  if (Validator.isEmpty(data.location.longPlace)) errors.location.longPlace = "Eligeix un punt de trobada";
  if (Validator.isEmpty(data.location.city)) errors.location.city = "Falta la ciutat";

  if (data.dateTime < new Date()) errors.dateTime = "El dia i hora seleccionats no són vàlids";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
