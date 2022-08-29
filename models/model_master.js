const mongoose = require('mongoose');

const masterSchema = mongoose.Schema({
    product_id: {
        type: String,
        required: true,
    },
    product_name: {
        type: String,
        required: true
    },
    product_image: {
        type: String,
        required: true
    }
});


mongoose.model('admin_product', masterSchema);
