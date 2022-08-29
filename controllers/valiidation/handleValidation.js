const mongoose = require('mongoose');

const User = mongoose.model('system_user');


var handleValidation = function (err, body) {
    for (field in err) {
        switch (err[field].context.key) {
            case 'user_name':
                body['usernameError'] = err[field].message;
                break;
            case 'user_password':
                body['userPasswordError'] = err[field].message;
                break;
            case 'product_id':
                body['idError'] = err[field].message;
                break;
            case 'product_name':
                body['nameError'] = err[field].message;
                break;
            default:
                break;
        };
    };
};

var routeValidation = async (req, res, next) => {
    if (req.currentUserId) {
        const currentUser = await User.findById({ _id: req.currentUserId });

        if (currentUser.user_type == 'admin' && req.originalUrl.includes('/admin/')) {
            next();
        } else {
            res.redirect('/admin/master');
        };
    };
};

var authentication = (req, res, next) => {
    var jwt = require('jsonwebtoken');

    var { token } = req.cookies;
    if (token) {
        const verified = jwt.verify(token, 'secretkeytrusttag');
        if (verified) {
            req.currentUserId = verified._id;
            next();
        } else {
            console.log('User is not authenticated');
            res.redirect('login');
        }

    } else {
        console.log('No token available');
        res.redirect('/login');
    };
};

module.exports = { handleValidation, routeValidation, authentication };