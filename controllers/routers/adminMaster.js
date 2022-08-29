const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer')
// const Product = require('../../models/model_master.js');
const Product = mongoose.model('admin_product');
const {handleValidation} = require('../valiidation/handleValidation.js');
const validateProduct = require('../valiidation/validateProduct.js');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const imageUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {

            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
})

router.get('/master', async (req, res) => {
    const allProduct = await Product.find({});
    res.render('admin/master', {
        viewTitle: 'Master',
        products: allProduct
    });
});

router.get('/master/insert', async (req, res) => {
    res.render('admin/addOrUpdateMaster', {
        viewTitle: 'Add Product',
    });
});

router.post('/master/insert', imageUpload.single('product_image'), async (req, res) => {
    var valid = await productValidation(req, res);
    if (valid) {
        if (req.body._id) {
            updateProduct(req, res);
            return
        }
        var saveObj = {
            product_image: req.file.filename,
            product_id: req.body.product_id,
            product_name: req.body.product_name
        };

        var product = new Product(saveObj);

        try {
            const saveProduct = await product.save();
            res.redirect('/admin/master');
        } catch (error) {
            req.body['saveError'] = 'Error while inserting data'
            res.render('admin/addOrUpdateMaster', {
                viewTitle: 'Add Product',
                productData: req.body
            });
        };
    } else {
        res.render('admin/addOrUpdateMaster', {
            viewTitle: 'Add Product',
            productData: req.body
        });
    }

});

router.get('/master/edit/:id', async (req, res) => {
    const findProduct = await Product.findById(req.params.id);
    res.render('admin/addOrUpdateMaster', {
        viewTitle: 'Edit Product',
        product: findProduct
    });
});

router.get('/master/delete/:id', async (req, res) => {
    var removeProduct = await Product.findByIdAndRemove(req.params.id);
    if (removeProduct) {
        res.redirect('/admin/master');
    };
});


var updateProduct = async (req, res) => {
    var updateProductData = await Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
    if (updateProductData) {
        res.redirect('/admin/master');
    };
};

const productValidation = async (req, res) => {
    var isValid = true;
    var validationResponse = validateProduct({ product_id: req.body.product_id, product_name: req.body.product_name });
    if (validationResponse.error) {
        handleValidation(validationResponse.error.details, req.body);
        isValid = false;
    } else {
        if (req.body._id) {
            const findProductById = await Product.findOne({ product_id: req.body.product_id });

            if (findProductById && (req.body._id !== findProductById._id.valueOf())) {
                req.body['idError'] = `Enter unique Product Id`;
                isValid = false;
            };

            const findProductByName = await Product.findOne({ product_name: req.body.product_name });

            if (findProductByName && (req.body._id !== findProductByName._id.valueOf())) {
                req.body['nameError'] = `Enter unique Product Name`;
                isValid = false;
            };
        };
    };

    return isValid;
};
module.exports = router;