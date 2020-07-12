require("dotenv").config();
var jwt = require("jsonwebtoken");
var express = require("express");
var app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MONGODB_URI =
  "mongodb+srv://tranvietbao11:vietbao123@qlttan.vnbwv.mongodb.net/QLTTAN?retryWrites=true&w=majority";
var PORT = process.env.PORT || 3000;
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/QLTTAN";

// var MONGODB_URI="mongodb://localhost/QLTTAN";
const GIANGVIEN_ROUTER = require("./routers/giangvien");
const HOCVIEN_ROUTER = require("./routers/hocvien");
const KHOAHOC_ROUTER = require("./routers/khoahoc");
const PHONGHOC_ROUTER = require("./routers/phonghoc");
const CAHOC_ROUTER = require("./routers/cahoc");
const LOPHOCPHAN_ROUTER = require("./routers/lophocphan");
const THUTRONGTUAN_ROUTER = require("./routers/thutrongtuan");
const LOPHOC_ROUTER = require("./routers/lophoc");
const CHITIETLOPHOC_ROUTER = require("./routers/chitietlophoc.js");
const LIENHE_ROUTER = require("./routers/lienhe.js");
const QUANTRI_ROUTER = require("./routers/quantri.js");
const TAIKHOAN_ROUTER = require("./routers/taikhoan.js");
const DANGNHAP_ROUTER = require("./routers/dangnhap.js");
const FRONTEND_ROUTER = require("./routers/frontend.js");
const THONGTINLOPHOC_ROUTER = require("./routers/thongtinlophoc.js");
const SENDMAIL_ROUTER = require("./routers/sendmail.js");

//verifyCaptcha
const VERIFY_CAPTCHA = require("./verifycaptcha/verifyCaptcha");
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});
app.get("", function (req, res) {
  return res.status(200).send({
    message: "Request Success",
  });
});
//verifycaptcha
app.post("/api/verifycaptcha", function (req, res) {
  let { response, secret } = req.body;
  if (response == null) {
    return res.status(403).send({
      message: "Token invalid",
    });
  }
  var verifycaptcha = new VERIFY_CAPTCHA(response, secret, res);
  verifycaptcha.verify();
});

//for admin
app.use("/api/taikhoan", DANGNHAP_ROUTER);
app.use("/api/frontend", FRONTEND_ROUTER);

app.use("/api/sendmail", SENDMAIL_ROUTER);
// app.use(function (req, res, next) {
//     if(req.headers && req.headers.authorization && String(req.headers.authorization.split(' ')[0].toLowerCase()==='bearer'))
//     {
//         jwt.verify(token,process.env.SECRETKEY||'hiepdv',function(err,decode){
//             if(err)
//             {
//                 return res.status(403).send({
//                     message:"Token invalid"
//                 });
//             }
//             else
//             {
//                 next();
//             }
//         });
//     }
//     else
//     {
//         return res.status(403).send({
//             message:"Unauthorization"
//         });
//     }
// });
app.use("/api/giangvien", GIANGVIEN_ROUTER);
app.use("/api/hocvien", HOCVIEN_ROUTER);
app.use("/api/khoahoc", KHOAHOC_ROUTER);
app.use("/api/phonghoc", PHONGHOC_ROUTER);
app.use("/api/cahoc", CAHOC_ROUTER);
app.use("/api/lophocphan", LOPHOCPHAN_ROUTER);
app.use("/api/thutrongtuan", THUTRONGTUAN_ROUTER);
app.use("/api/lophoc", LOPHOC_ROUTER);
app.use("/api/chitietlophoc", CHITIETLOPHOC_ROUTER);
app.use("/api/lienhe", LIENHE_ROUTER);
app.use("/api/quantri", QUANTRI_ROUTER);
app.use("/api/taikhoan", TAIKHOAN_ROUTER);
app.use("/api/thongtinlophoc", THONGTINLOPHOC_ROUTER);

app.get("/", function (req, res) {
  // console.log(MONGODB_URI);
  return res.json({ txt: "get data" });
});
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log("Server started at " + PORT));
});
// exports = module.exports=app;
