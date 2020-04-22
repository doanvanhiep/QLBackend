module.exports = function (responseAPI,secretAPI,resRS) {
    var req = require('request');
    this.verify=function () {
        req.post(
            'https://www.google.com/recaptcha/api/siteverify',
            {form:{ response: responseAPI,secret:secretAPI }},
            function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    return resRS.json({res:body});
                }
            }
        );
    }
}