const Validator = require('validator');
const isEmpty = require('is-empty');

exports.validateCommentaryInput = (data) => {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.message = !isEmpty(data.message) ? data.message : "";
  data.author.authorId = !isEmpty(data.author.authorId) ? data.author.authorId : "";
  data.author.authorName = !isEmpty(data.author.authorName) ? data.author.authorName : "";
  data.activityId = !isEmpty(data.activityId) ? data.activityId : "";

  // Checks if fields are empty
  if (Validator.isEmpty(data.message)) errors.message = "Afegeix un comentari";
  if (Validator.isEmpty(data.author.authorId)) errors.author.authorId = "Falta la ID de l'usuari";
  if (Validator.isEmpty(data.author.authorName)) errors.author.authorName = "Falta el nom de l'usuari";
  if (Validator.isEmpty(data.activityId)) errors.activityId = "Falta la ID de l'activitat";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};


exports.validateUpdatedCommentaryInput = (data) => {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.message = !isEmpty(data.message) ? data.message : "";

  // Checks if fields are empty
  if (Validator.isEmpty(data.message)) errors.message = "Afegeix un comentari";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
