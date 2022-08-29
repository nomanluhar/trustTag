const Joi = require('joi')

function validateProduct(product) {
    const JoiSchema = Joi.object({

        product_id: Joi.string()
            .required(),

        product_name: Joi.string()
            .required(),
    }).options({ abortEarly: false });

    return JoiSchema.validate(product)
}

module.exports = validateProduct;
