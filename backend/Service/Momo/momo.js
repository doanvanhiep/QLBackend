module.exports = function (responseS) {
    //Send the request and get the response
    this.SendMoMo = function (HoTen,Email,SoDienThoai,amount,orderId,requestId) {
        const https = require('https');
        //parameters send to MoMo get get payUrl
        var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor";
        var hostname = "https://test-payment.momo.vn";
        var path = "/gw_payment/transactionProcessor";
        var partnerCode = "MOMORFPV20200314"//"MOMO"
        var accessKey = "sfzlXRsBlXvP2AY1"//"F8BBA842ECF85"
        var serectkey = "SOg2mZucehzzhhpvgQ25P9ahoS1wjWpI";//"K951B6PE1waDMi640xX08PD3vg6EkVlz"
        var orderInfo = "Thanh toán học phí Trung Tâm Anh Ngữ";
        var returnUrl = "https://ttanfrontend.herokuapp.com/thanhtoanmomo";
        var notifyurl = "https://ttanbackend.herokuapp.com/api/frontend/thanhtoanmomo";
        // var amount = SoTien;
        // var orderId = orderID;
        // var requestId = uuidv1()
        //var orderId = "123"
        //var requestId = "1234"
        var requestType = "captureMoMoWallet"
        var extraData = "HoTen="+HoTen+";Email="+Email+";SDT="+SoDienThoai;//"merchantName=;merchantId=" //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store

        //before sign HMAC SHA256 with format
        //partnerCode=$partnerCode&accessKey=$accessKey&requestId=$requestId&amount=$amount&orderId=$oderId&orderInfo=$orderInfo&returnUrl=$returnUrl&notifyUrl=$notifyUrl&extraData=$extraData
        var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData

        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', serectkey)
            .update(rawSignature)
            .digest('hex');

        //json object send to MoMo endpoint
        var body = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            returnUrl: returnUrl,
            notifyUrl: notifyurl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
        })
        console.log(body);
        //Create the HTTPS objects
        var options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/gw_payment/transactionProcessor',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        }; 
        var req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (body) => {
                var urlResult = JSON.parse(body).payUrl;
                return responseS.json({ error: false, url: urlResult });
            });
            // res.on('end', () => {
            //     return responseS.json({ error: true, message: 'No more data in response.' });
            // });
        });

        req.on('error', (e) => {
            return responseS.json({ error: true, message: `problem with request: ${e.message}` });
        });

        // write data to request body
        req.write(body);
        req.end();
    }

}