const Joi = require('joi')

function validateUser(user) {
    const JoiSchema = Joi.object({

        user_name: Joi.string()
            .required(),

        user_password: Joi.string()
            .required(),
    }).options({ abortEarly: false });

    return JoiSchema.validate(user)
}

module.exports = validateUser;
