const Joi = require('joi');

const credentialValidation = data => {
	const passwordValidationSchema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required()
	});

	return passwordValidationSchema.validate(data);
};

module.exports.credentialValidation = credentialValidation;
