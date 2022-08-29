const mongoose = require('mongoose');

const codeSchema = mongoose.Schema({
    product_id: {
        type: String,
        required: true,
    },
    batch_no: {
        type: String,
        required: true,
    },
    exp_date: {
        type: String,
        required: true,
    },
    mfg_date: {
        type: String,
        required: true,
    },
    codes : []
});


mongoose.model('unique_code', codeSchema);
