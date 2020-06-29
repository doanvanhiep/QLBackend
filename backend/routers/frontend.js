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
        let content = "Thanh toán thất bại vui lòng liên hệ trung tâm hieptest12345@gmail.com "+TenHocVien;
        Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
        return res.json({ error: true, url: "thanhtoanmomo", queryParams: "Fail" });
    }
    if (HinhThucThanhToan === "trungtam") {
        let content = "Thanh toán thành công vui lòng liên hệ trung tâm hieptest12345@gmail.com "+TenHocVien;
        Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
        return res.json({ error: false, url: "thanhtoanmomo", queryParams: "Success" });
    }
    var IDHocVien = kq.data.IDHocVien
    var dateString = ThoiGianDangKi.substring(10);
    var orderId = dateString + "-thanh-toan-hoc-phi-" + SoDienThoai;
    var requestId = dateString;
    var MoMo = new ServiceMoMo(res);
    SoTien = SoTien.toString();
    MoMo.SendMoMo(TenHocVien, Email, SoDienThoai, SoTien, orderId, requestId, IDLopHoc, IDHocVien);
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
        let content = "Thanh toán thất bại vui lòng liên hệ trung tâm hieptest12345@gmail.com "+HoTen;
        Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
    }
    else {
        let TrangThaiThanhToan=1;
        HOCVIEN_MODEL.updateStatusPay({ IDHocVien, IDLopHoc, TrangThaiThanhToan })
        let content = "Thanh toán thành công vui lòng liên hệ trung tâm hieptest12345@gmail.com  "+HoTen;
        Mail.SendMail("Đăng kí lớp học", content, attachments, maillist);
    }
});

module.exports = route;