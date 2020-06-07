const route = require('express').Router();
const HOCVIEN_MODEL = require('../models/HocVien');

route.get('/danhsach', async (req, res) => {
    let result = await HOCVIEN_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let { IDLopHoc,TenHocVien, Email, SoDienThoai, ThoiGianDangKi,HinhThucThanhToan,SoTien, TrangThaiThanhToan,NguoiThem} = req.body;
    try {
        let result = await HOCVIEN_MODEL.add({IDLopHoc,TenHocVien, Email, SoDienThoai, ThoiGianDangKi,HinhThucThanhToan,SoTien, TrangThaiThanhToan,NguoiThem});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/suatrangthaithanhtoan/:IDHocVien/:IDLopHoc', async (req, res) => {
    let IDHocVien= req.params.IDHocVien;
    let IDLopHoc= req.params.IDLopHoc;
    let { TrangThaiThanhToan} = req.body;
    try {
        let result = await HOCVIEN_MODEL.update({IDHocVien,IDLopHoc,TrangThaiThanhToan});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
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