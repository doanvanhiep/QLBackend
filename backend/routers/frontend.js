const route = require('express').Router();
// const uuidv1 = require('uuidv1');
const KHOAHOC_MODEL = require('../models/KhoaHoc');
const LOPHOCPHAN_MODEL = require('../models/LopHocPhan');
const LOPHOC_MODEL = require('../models/LopHoc');
const HOCVIEN_MODEL = require('../models/HocVien');
const LIENHE_MODEL = require('../models/LienHe');
const GIANGVIEN_MODEL = require('../models/GiangVien');
const ServiceMoMo = require('../Service/Momo/momo');


function getCurrentDate()
{
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
    let ThoiGianDangKi = this.getCurrentDate();
    let TrangThaiThanhToan = 0;
    let NguoiThem = "online";
    let kq = await HOCVIEN_MODEL.add({ IDLopHoc, TenHocVien, Email, SoDienThoai, ThoiGianDangKi, HinhThucThanhToan, SoTien, TrangThaiThanhToan, NguoiThem });
    if (kq.error == true) {
        return res.json({ error: true, url: "thanhtoanmomo", queryParams: "Fail" });
    }
    if (HinhThucThanhToan === "trungtam") {
        return res.json({ error: false, url: "thanhtoanmomo", queryParams: "Success" });
    }
    var dateString = date + "-" + month + "-" + year;
    var orderId = dateString + "-thanh-toan-hoc-phi-" + SoDienThoai;
    var requestId = currentDate.getTime().toString();
    var MoMo = new ServiceMoMo(res)
    MoMo.SendMoMo(HoTen, Email, SoDienThoai, SoTien, orderId, requestId);
});
route.post('/thanhtoanmomo', async (req, res) => {
    console.log(req);
    return;
    let { requestId, errorCode, message } = req.body;
    console.log({ requestId, errorCode, message });
});

module.exports = route;