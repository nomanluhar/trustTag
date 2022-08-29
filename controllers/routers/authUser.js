const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
var jwt = require('jsonwebtoken');
const User = mongoose.model('system_user');
const { handleValidation } = require('../valiidation/handleValidation.js');
const validateUser = require('../valiidation/validateUser.js');

//--this is data save api only for testing purpose
// router.post('/', async (req, res) => {
//     const user = new User(req.body)
//     try {
//         const saveUser = await user.save();
//         res.json(saveUser);
//     } catch (error) {
//         res.send(error);
//     };
// });

router.get('/', async (req, res) => {
    res.render('login/login', {
        viewTitle: 'Login',
    });
})

router.post('/', async (req, res) => {
    const loginUser = await User.findOne({ user_name: req.body.user_name });
    var valid = userValidation(req, loginUser);
    if (valid) {
        var token = await accessTokenGenerator(loginUser);

        if (loginUser.user_type == 'admin') {
            res.cookie('token', token, { httpOnly: true }).redirect('/admin/master');
        };
    } else {
        res.render('login/login', {
            viewTitle: 'Login',
            userData: req.body,
        });
    };
});


async function userValidation(req, loginUser) {
    var isValid = true
    var validationResponse = validateUser(req.body);
    if (validationResponse.error) {
        handleValidation(validationResponse.error.details, req.body);
        isValid = false
    } else if (!loginUser) {
        req.body['usernameError'] = 'User not found';
        isValid = false
    } else if (loginUser && (loginUser.user_password !== req.body.user_password)) {
        req.body['userPasswordError'] = 'Password does not match';
        isValid = false
    };
    return isValid
};

async function accessTokenGenerator(user) {
    var accessToken = await jwt.sign({ _id: user._id }, 'secretkeytrusttag');
    return accessToken
};



module.exports = router;