const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
var uniqid = require('uniqid');
const Product = mongoose.model('admin_product');
const Code = mongoose.model('unique_code');

router.get('/generator', async (req, res) => {
    var findAllProduct = await Product.find();


    res.render('admin/codeGenerate', {
        viewTitle: 'Generate Code',
        product: findAllProduct
    });
});

router.post('/generator', async (req, res) => {
    const QRCodeQuantity = Number(req.body.qr_code);
    const arr = await qrCode(QRCodeQuantity);

    let obj = {
        product_id: req.body.product_id,
        batch_no: req.body.batch_no,
        mfg_date: req.body.mfg_date,
        exp_date: req.body.exp_date,
        qr_code: req.body.qr_code,
        codes: arr
    };
    var code = new Code(obj);

    try {
        const saveCode = await code.save();
        res.redirect('/admin/code/list');
    } catch (error) {
        var findAllProduct = await Product.find();
        req.body['saveError'] = 'Error while inserting data',
        res.render('admin/codeGenerate', {
            viewTitle: 'Generate Code',
            product: findAllProduct
        });
    };





});

var qrCode = (num) => {
    let qrCodeArr = []
    for (let i = 0; i < num; i++) {
        qrCodeArr.push(uniqid());
    };

    return qrCodeArr
};

router.get('/list',async (req,res) => {
   const findAllGenerateCode = await Code.find();

   res.render('admin/listOfCode', {
    viewTitle: 'Codes list',
    codes: findAllGenerateCode
});
})

module.exports = router;