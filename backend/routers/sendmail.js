const route = require('express').Router();
const ServiceMail = require('../Service/Mail/mail');
//send Mail
var multer = require('multer');
const uploadfile = multer()
var nodemailer = require('nodemailer');
route.post('/send', uploadfile.array('file'), async (req, res) => {
    let fileObject = req.files;
    let attachments = [];
    if (fileObject != undefined) {
        const start = async () => {
            await  fileObject.forEach(function(f,i){
                let originalname=f.originalname;
                attachments[i]={ filename: originalname, content: f.buffer};
            });
        }
        await start();
    }
    var maillist=[
        'doanvanhiepebn951@gmail.com',
        '16110074@student.hcmute.edu.vn'
    ]
        var Mail = new ServiceMail(nodemailer)
        //let result = await Mail.SendMail(req.params.subject, req.params.content, attachments, req.params.maillist);
        let result = await Mail.SendMail("req.params.subject", "req.params.content", attachments, maillist);
        return res.json({ result });
    });
module.exports = route;