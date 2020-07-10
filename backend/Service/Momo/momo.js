module.exports = function (responseS) {
    //Send the request and get the response
    this.SendMoMo = function (HoTen, Email, SoDienThoai, amount, orderId, requestId, IDLopHoc, IDHocVien, Mail) {
        const https = require('https');
        function getCurrentDateDMY() {
            var currentDate = new Date();
            var date = currentDate.getDate();
            var month = currentDate.getMonth() + 1; //Be careful! January is 0 not 1
            var year = currentDate.getFullYear();
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            return date + "-" + month + "-" + year;
        }
        function getContentMailSample() {
            return datasample = '<head>' +
                '</head>' +
                '<body style="background-color: #ecebf0; font-family: Verdana;font-size:13px;">' +
                '<table style="min-width:320px;width:100%;margin:0;padding:0" border="0" cellspacing="0" cellpadding="0">' +
                '<tbody>' +
                '<tr>' +
                '<td style="padding-top:30px;padding-bottom:30px" align="center" bgcolor="#ecebf0">' +
                '<table style="max-width:600px;min-width:320px;width:100%;margin:0;padding:0" border="0" cellspacing="0" cellpadding="0">' +
                '<tbody>' +
                '<tr>' +
                '<td bgcolor="#ffffff">' +
                '<table style="min-width:240px;width:100%;padding:0;margin:auto" border="0" cellspacing="0" cellpadding="0">' +
                '<tbody>' +
                '<tr>' +
                '<td style="padding-top:10px;padding-left:40px;padding-right:40px;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#e6e6e6" bgcolor="#ffffff">' +
                '<h3>Trung tâm anh ngữ</h3>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><p style="border-top:solid 2px #0070C0;font-size:1px;margin:0px auto;width:100%;"> </p></td>' +
                '<td><p style="border-top:solid 2px #0070C0;font-size:1px;margin:0px auto;width:100%;"> </p></td>' +
                '</tr>' +
                '<tr>' +
                '<td style="padding-top:10px;padding-left:40px;padding-right:40px" bgcolor="#ffffff">' +
                '<b><font style="color:#0070C0;font-style:italic" size="3">Đăng kí lớp học</font></b>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#e6e6e6;padding:0px 40px 15px 40px">' +
                '<p style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;line-height:10px"> Xin chào <strong><i>{{HoTen}}</i></strong>, </p>' +
                '<p style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;line-height:10px"> Hôm nay <strong><i>{{NgayThang}}</i></strong> </p>' +
                '<p style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;line-height:20px">{{NoiDung}} </p>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<table style="min-width:320px;width:100%;padding:0;margin:auto;margin-bottom:36px" border="0" cellspacing="0" cellpadding="0">' +
                '<tbody>' +
                '<tr>' +
                '<td width="40">&nbsp;</td>' +
                '<td style="padding-top:20px;font-family:Open Sans,Tahoma,Helvetica,Verdana;font-style:italic;font-size:14px;color:#2e363a;line-height:21px;margin-top:2px">' +
                'Trân trọng,<br>Trung tâm anh ngữ<br>' +
                '<a style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;text-decoration:none !important" href="mailto:info@primas.net">trungtamanhngu@gmail.com</a>&nbsp;&nbsp;&nbsp;' +
                '<a style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;text-decoration:none !important" href="tel:+18884774627">+84 123 123 123</a>' +
                '</td>' +
                '<td width="40">' +
                '&nbsp;' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</body>';
        }
        //parameters send to MoMo get get payUrl
        var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor";
        var hostname = "https://test-payment.momo.vn";
        var path = "/gw_payment/transactionProcessor";
        var partnerCode = "MOMORFPV20200314"//"MOMO"
        var accessKey = "sfzlXRsBlXvP2AY1"//"F8BBA842ECF85"
        var serectkey = "SOg2mZucehzzhhpvgQ25P9ahoS1wjWpI";//"K951B6PE1waDMi640xX08PD3vg6EkVlz"
        var orderInfo = "Thanh toán học phí Trung Tâm Anh Ngữ";
        var returnUrl = "https://f11829db7f2f.ngrok.io/thanhtoanmomo";          //front end
        var notifyurl = "https://9d614a283391.ngrok.io/api/frontend/thanhtoanmomo"; /// backend
        var requestType = "captureMoMoWallet"
        var extraData = "HoTen=" + HoTen + ";Email=" + Email + ";SDT=" + SoDienThoai + ";IDLopHoc=" + IDLopHoc + ";IDHocVien=" + IDHocVien;//"merchantName=;merchantId=" //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store
        //before sign HMAC SHA256 with format
        //partnerCode=$partnerCode&accessKey=$accessKey&requestId=$requestId&amount=$amount&orderId=$oderId&orderInfo=$orderInfo&returnUrl=$returnUrl&notifyUrl=$notifyUrl&extraData=$extraData
        var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData
        let attachments = [];
        let maillist = [Email];
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
                var errorCode = JSON.parse(body).errorCode;
                if (errorCode == 0) {
                    var urlResult = JSON.parse(body).payUrl;
                    return responseS.json({ error: false, url: urlResult });
                }
                let content = getContentMailSample().replace('{{HoTen}}', HoTen);
                let NoiDung = "Đăng kí lớp học thành công. Nhưng thanh toán thất bại. Vui lòng liên hệ trung tâm để được hỗ trợ";
                content = content.replace('{{NgayThang}}', getCurrentDateDMY());
                content = content.replace('{{NoiDung}}', NoiDung);
                Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
                return responseS.json({ error: true, url: "thanhtoanmomo", queryParams: "Fail" });
            });
            // res.on('end', () => {
            //     return responseS.json({ error: true, message: 'No more data in response.' });
            // });
        });

        req.on('error', (e) => {
            let content = getContentMailSample().replace('{{HoTen}}', HoTen);
            let NoiDung = "Đăng kí lớp học thành công. Nhưng thanh toán thất bại. Vui lòng liên hệ trung tâm để được hỗ trợ";
            content = content.replace('{{NgayThang}}', getCurrentDateDMY());
            content = content.replace('{{NoiDung}}', NoiDung);
            Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
            return responseS.json({ error: true, url: "thanhtoanmomo", queryParams: "Fail" });
        });

        // write data to request body
        req.write(body);
        req.end();
    }

}