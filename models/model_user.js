const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    user_password: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer',
    }
});


mongoose.model('system_user', userSchema);
