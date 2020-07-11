module.exports = function (nodemailer) {
  //Send the request and get the response
  this.SendMail = function (subject, content, attachments, maillist) {
    return new Promise(async (resolve) => {
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "trungtamanhngu.vn@gmail.com",
          pass: "vietbaovanhiep",
        },
      });
      maillist.forEach(function (to) {
        var mainOptions = {
          from: '"Trung Tâm Anh Ngữ" <hieptest12345@gmail.com>',
          to: to,
          subject: subject,
          //text: content,
          html: content,
          attachments: attachments,
        };
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log(err + " mail can't send to " + to);
          } else {
            console.log(
              "Message sent: " + info.response + " mail sent to " + to
            );
          }
        });
      });
      return resolve({ error: false, message: "sent mail" });
    });
  };
};
