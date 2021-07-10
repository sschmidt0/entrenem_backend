const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateActivityInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.category = !isEmpty(data.category) ? data.category : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.dateTime = !isEmpty(data.dateTime) ? data.dateTime : "";
  data.place = !isEmpty(data.place) ? data.place : "";
  data.longPlace = !isEmpty(data.longPlace) ? data.longPlace : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.createdBy = !isEmpty(data.createdBy) ? data.createdBy : "";
  data.createdByName = !isEmpty(data.createdByName) ? data.createdByName : "";
  data.lat = !isEmpty(data.lat) ? data.lat : "";
  data.lng = !isEmpty(data.lng) ? data.lng : "";
  data.city = !isEmpty(data.city) ? data.city : "";

  // Checks if fields are empty
  if (Validator.isEmpty(data.category)) errors.category = "Eligeix una categoria";
  if (Validator.isEmpty(data.title)) errors.title = "Escriu un títol";
  if (Validator.isEmpty(data.dateTime)) errors.dateTime = "Eligeix dia i hora";
  if (Validator.isEmpty(data.place)) errors.place = "Eligeix un punt de trobada";
  if (Validator.isEmpty(data.longPlace)) errors.longPlace = "Eligeix un punt de trobada";
  if (Validator.isEmpty(data.description)) errors.description = "Afegeix una petita descripció";
  if (Validator.isEmpty(data.createdBy)) errors.createdBy = "Falta la ID de l'usuari";
  if (Validator.isEmpty(data.createdByName)) errors.createdByName = "Falta el nom de l'usuari";
  if (Validator.isEmpty(data.lat)) errors.lat = "Falta la lat del lloc";
  if (Validator.isEmpty(data.lng)) errors.lng = "Falta la lng del lloc";
  if (Validator.isEmpty(data.city)) errors.city = "Falta la ciutat";

  if (data.dateTime < new Date()) errors.dateTime = "El dia i hora seleccionats no són vàlids";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
