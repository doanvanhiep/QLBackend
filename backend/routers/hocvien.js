const route = require('express').Router();
const HOCVIEN_MODEL = require('../models/HocVien');

route.get('/danhsach', async (req, res) => {
    let result = await HOCVIEN_MODEL.getList();
    return res.json({result});
});
route.get('/danhsachbyidlophoc/:IDLopHoc', async (req, res) => {
    let IDLopHoc=req.params.IDLopHoc;
    let result = await HOCVIEN_MODEL.getListByIDLopHoc(IDLopHoc);
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let { IDLopHoc,TenHocVien, Email, SoDienThoai,SoTien,NguoiThem} = req.body;
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth()+1; //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var seconds = currentDate.getSeconds();
    var minutes = currentDate.getMinutes();
    var hour = currentDate.getHours();
    let TrangThaiThanhToan = 1;
    let HinhThucThanhToan="trungtam";
    if(month<10) month="0"+month;
    if(date<10) date="0"+date;
    if(hour<10) hour="0"+hour;
    if(minutes<10) minutes="0"+minutes;
    if(seconds<10) seconds="0"+seconds;
    let ThoiGianDangKi = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+seconds;
    try {
        let result = await HOCVIEN_MODEL.add({IDLopHoc,TenHocVien, Email, SoDienThoai, ThoiGianDangKi,HinhThucThanhToan,SoTien, TrangThaiThanhToan,NguoiThem});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/suatrangthaithanhtoan', async (req, res) => {
    var {IDHocVien,IDLopHoc,TrangThaiThanhToan} = req.body;
    try {
        let result = await HOCVIEN_MODEL.updateStatusPay({IDHocVien,IDLopHoc,TrangThaiThanhToan});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/suatrangthai', async (req, res) => {
    var {IDHocVien,IDLopHoc,TrangThai} = req.body;
    try {
        let result = await HOCVIEN_MODEL.updateStatus({IDHocVien,IDLopHoc,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/sua', async (req, res) => {
    var {IDHocVien,IDLopHoc,TenHocVien, SoDienThoai, Email,IDLopHocCu} = req.body;
    try {
        var result = await HOCVIEN_MODEL.update(IDHocVien,IDLopHoc,TenHocVien, SoDienThoai, Email,IDLopHocCu);
        return res.json({ "TrangThai": result })
    } catch (error) {
        return res.json({ "TrangThai": result })
    }
});
route.delete('/xoa/:IDHocVien/:IDLopHoc', async (req, res) => {
    let IDHocVien= req.params.IDHocVien;
    let IDLopHoc= req.params.IDLopHoc;
    try {
        let result = await HOCVIEN_MODEL.delete(IDHocVien,IDLopHoc);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;