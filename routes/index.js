var router = require('express').Router(),
    request = require('request'),
    moment = require('moment'),
    Allpay = require('../utils/allpay');

var allpay = new Allpay('http://localhost:5051', '5294y06JbISpM5x9', 'v77hoKGq4kWxNNIS', '2000132');

router.post('/AioCheckOut', function(req, res, next) {
    // TODO: check if the CheckMacValue in req.body is correct
    var form = {
        MerchantID: req.body.MerchantID,
        MerchantTradeNo: req.body.MerchantTradeNo,
        RtnCode: 1,
        RtnMsg: 'paid',
        TradeNo: parseInt(Math.random() * 1000000000),
        TradeAmt: req.body.TotalAmount,
        PaymentDate: moment().format('YYYY/MM/DD HH:mm:ss'),
        PaymentType: req.body.ChoosePayment,
        PaymentTypeChargeFee: 0,
        TradeDate: moment().format('YYYY/MM/DD HH:mm:ss'),
        SimulatePaid: 0
    };
    var checkMacValue = allpay.genCheckMacValue(form);
    form.CheckMacValue = checkMacValue;
    request.post({
            url: req.body.ReturnURL,
            form: form
        },
        function(err, response, body) {
            if (err) {
                return next(err);
            }
            // TODO: check if the merchant's server return 1|OK code
            res.redirect(req.body.OrderResultURL);
        });
});

module.exports = router;
