module.exports = function (nodemailer) {
    //Send the request and get the response
    this.SendMail = function (subject, content, attachments, maillist) {
        return new Promise(async resolve => {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'hieptest12345@gmail.com',
                    pass: 'hieptest12345678'
                }
            });
            const start = async () => {
                await maillist.forEach(function (to) {
                    var mainOptions = {
                        from: '"Hiệp đẹp trai" <hieptest12345@gmail.com>',
                        to: to,
                        subject: subject,
                        //text: content,
                        html: content,
                        attachments: attachments
                    }
                    transporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err + " mail can't send to " + to);
                        } else {
                            console.log('Message sent: ' + info.response + " mail sent to " + to);
                        }
                    });
                });
            }
            await start();
            console.log("á");
            return resolve({ error: false, message: "sent mail" });
        })
    }
}