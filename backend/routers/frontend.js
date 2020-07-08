const route = require('express').Router();
// const uuidv1 = require('uuidv1');
const KHOAHOC_MODEL = require('../models/KhoaHoc');
const LOPHOCPHAN_MODEL = require('../models/LopHocPhan');
const LOPHOC_MODEL = require('../models/LopHoc');
const HOCVIEN_MODEL = require('../models/HocVien');
const LIENHE_MODEL = require('../models/LienHe');
const GIANGVIEN_MODEL = require('../models/GiangVien');
const ServiceMoMo = require('../Service/Momo/momo');
const ServiceMail = require('../Service/Mail/mail');
//send Mail
var multer = require('multer');
const uploadfile = multer();
var nodemailer = require('nodemailer');
function getCurrentDate() {
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth() + 1; //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var seconds = currentDate.getSeconds();
    var minutes = currentDate.getMinutes();
    var hour = currentDate.getHours();
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    let res = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds;
    return res;
}
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
route.get('/khoahoc', async (req, res) => {
    let result = await KHOAHOC_MODEL.getList();
    return res.json({ result });
});
route.get('/lophocphan', async (req, res) => {
    let result = await LOPHOCPHAN_MODEL.getList();
    return res.json({ result });
});
route.get('/giangvien', async (req, res) => {
    let result = await GIANGVIEN_MODEL.getList();
    return res.json({ result });
});
route.get('/cahocbuoihocbylophocphan/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan = req.params.IDLopHocPhan;
    let result = await LOPHOC_MODEL.getListCaBuoiHocByIDLopHocPhan(IDLopHocPhan);
    return res.json({ result });
});
route.get('/lophocphan/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan = req.params.IDLopHocPhan;
    let result = await LOPHOCPHAN_MODEL.getLopHocPhanByID(IDLopHocPhan);
    return res.json({ result });
});
route.get('/lophoc/:IDLopHocPhan/:IDLopHoc', async (req, res) => {
    let IDLopHocPhan = req.params.IDLopHocPhan;
    let IDLopHoc = req.params.IDLopHoc;
    let result = await LOPHOC_MODEL.getInfoLopHoc(IDLopHocPhan, IDLopHoc);
    return res.json({ result });
});
route.get('/getngaykhaigianglophoc/:IDLopHoc', async (req, res) => {
    let IDLopHoc = req.params.IDLopHoc;
    let result = await LOPHOC_MODEL.getNgayKhaiGiangLopHoc(IDLopHoc);
    return res.json({ result });
});
route.post('/lienhe', async (req, res) => {
    let { HoTen, Email, SoDienThoai, NoiDung } = req.body;
    let ThoiGian = getCurrentDate();
    try {
        let result = await LIENHE_MODEL.add({ HoTen, Email, SoDienThoai, NoiDung, ThoiGian });
        return res.json({ "TrangThai": result })
    } catch (error) {
        return res.json({ "TrangThai": result })
    }
});
route.post('/dangkilophoc', async (req, res) => {
    let { TenHocVien, Email, SoDienThoai, IDLopHoc, HinhThucThanhToan, SoTien } = req.body;
    let ThoiGianDangKi = getCurrentDate();
    let TrangThaiThanhToan = 0;
    let NguoiThem = "online";
    let kq = await HOCVIEN_MODEL.add({ IDLopHoc, TenHocVien, Email, SoDienThoai, ThoiGianDangKi, HinhThucThanhToan, SoTien, TrangThaiThanhToan, NguoiThem });
    let attachments = [];
    let maillist = [Email];
    var Mail = new ServiceMail(nodemailer)
    if (kq.error == true) {
        let content = getContentMailSample().replace('{{HoTen}}', TenHocVien);
        let NoiDung = "Đăng kí lớp học không thành công. Vui lòng liên hệ trung tâm để được hỗ trợ";
        content = content.replace('{{NgayThang}}', getCurrentDateDMY());
        content = content.replace('{{NoiDung}}', NoiDung);
        Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
        return res.json({ error: true, url: "thanhtoanmomo", queryParams: "Fail" });
    }
    if (HinhThucThanhToan === "trungtam") {
        let content = getContentMailSample().replace('{{HoTen}}', TenHocVien);
        let NoiDung = "Đăng kí lớp học thành công. Bạn cần đến trung tâm để hoàn tất thanh toán. Hoặc liên hệ trung tâm để được hỗ trợ.";
        content = content.replace('{{NgayThang}}', getCurrentDateDMY());
        content = content.replace('{{NoiDung}}', NoiDung);
        Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
        return res.json({ error: false, url: "thanhtoanmomo", queryParams: "Success" });
    }
    var IDHocVien = kq.data.IDHocVien
    var dateString = ThoiGianDangKi.substring(10);
    var orderId = dateString + "-thanh-toan-hoc-phi-" + SoDienThoai;
    var requestId = dateString;
    var MoMo = new ServiceMoMo(res);
    SoTien = SoTien.toString();
    MoMo.SendMoMo(TenHocVien, Email, SoDienThoai, SoTien, orderId, requestId, IDLopHoc, IDHocVien, Mail);
});
route.post('/thanhtoanmomo', async (req, res) => {
    let { errorCode, extraData } = req.body;
    dataReq = extraData.split(';');
    let Email = dataReq[1].split('=')[1];
    let HoTen = dataReq[0].split('=')[1];
    let IDLopHoc = dataReq[3].split('=')[1];
    let IDHocVien = dataReq[4].split('=')[1];
    let attachments = [];
    let maillist = [Email];
    var Mail = new ServiceMail(nodemailer)

    if (parseInt(errorCode, 10) != 0) {
        //sendmail
        let content = getContentMailSample().replace('{{HoTen}}', HoTen);
        let NoiDung = "Đăng kí lớp học thành công. Nhưng thanh toán thất bại. Vui lòng liên hệ trung tâm để được hỗ trợ";
        content = content.replace('{{NgayThang}}', getCurrentDateDMY());
        content = content.replace('{{NoiDung}}', NoiDung);
        Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
    }
    else {
        let TrangThaiThanhToan = 1;
        HOCVIEN_MODEL.updateStatusPay({ IDHocVien, IDLopHoc, TrangThaiThanhToan })
        let content = getContentMailSample().replace('{{HoTen}}', HoTen);
        let NoiDung = "Đăng kí lớp học và thanh toán thành công.";
        content = content.replace('{{NgayThang}}', getCurrentDateDMY());
        content = content.replace('{{NoiDung}}', NoiDung);
        Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
    }
});

module.exports = route;