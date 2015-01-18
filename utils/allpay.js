'use strict';

var _ = require('underscore'),
    crypto = require('crypto'),
    moment = require('moment');

function AllpayCreditCard(serviceUrl, hashKey, hashIV, merchantId) {
    this.serviceUrl = serviceUrl;
    this.hashKey = hashKey;
    this.hashIV = hashIV;
    this.merchantId = merchantId;

    this.variables = {
        'MerchantID': merchantId,
        'ReturnURL': '',
        // 'ClientBackURL': 'http://localhost:3000',
        'OrderResultURL': '',
        'MerchantTradeNo': null,
        'MerchantTradeDate': null,
        'PaymentType': 'aio',
        'TotalAmount': 0,
        // TODO: check the usage of TradeDesc
        'TradeDesc': 'trade',
        'ChoosePayment': 'Credit',
        'Remark': '',
        'ChooseSubPayment': '',
        'NeedExtraPaidInfo': 'N',
        'DeviceSource': 'P',
        'CreditInstallment': 0,
        'InstallmentAmount': 0,
        'Redeem': '',
        'UnionPay': '',
        'PeriodAmount': '',
        'PeriodType': '',
        'Frequency': '',
        'ExecTimes': '',
        'PeriodReturnURL': '',
        'ItemName': '',
        'ItemURL': ''
    };
}

AllpayCreditCard.prototype = {
    genPaymentInfo: function(merchantTradeNo, itemName, price, returnUrl, orderResultUrl) {
        this.variables.MerchantTradeNo = merchantTradeNo;
        this.variables.ItemName = itemName;
        this.variables.TotalAmount = price;
        this.variables.ReturnURL = returnUrl;
        this.variables.OrderResultURL = orderResultUrl;
        this.variables.MerchantTradeDate = moment().format('YYYY/MM/DD HH:mm:ss');

        var checkMacValue = this.genCheckMacValue(this.variables);

        var form = '<div style="text-align:center;" ><form id="__allpayForm" method="post" target="_self" action="' + this.serviceUrl + '">';
        for (var key in this.variables) {
            form += '<input type="hidden" name="' + key + '" value="' + this.variables[key] + '" />';
        }
        form += '<input type="hidden" name="CheckMacValue" value="' + checkMacValue + '" />';
        form += '<script type="text/javascript">document.getElementById("__allpayForm").submit();</script>';
        form += '</form></div>';

        return {
            form: form,
            checkMacValue: checkMacValue
        };
    },
    genCheckMacValue: function(variables) {
        var allpay = this;

        // sorted by key
        var keys = Object.keys(variables);
        var sortedKeys = _.sortBy(keys, function(key) {
            return key;
        });

        var uri = _.map(sortedKeys, function(key) {
            return key + '=' + variables[key];
        }).join('&');

        uri = 'HashKey=' + allpay.hashKey + '&' + uri + '&HashIV=' + allpay.hashIV;
        uri = encodeURIComponent(uri).replace(/%20/g, '+').toLowerCase();

        var checksum = crypto.createHash('md5').update(uri).digest('hex').toUpperCase();

        return checksum;
    }
};

module.exports = AllpayCreditCard;
