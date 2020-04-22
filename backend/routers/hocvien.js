const route = require('express').Router();
const HOCVIEN_MODEL = require('../models/HocVien');

route.get('/danhsach', async (req, res) => {
    let result = await HOCVIEN_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let { TenHocVien, Email, SoDienThoai, ThoiGianDangKi} = req.body;
    try {
        let result = await HOCVIEN_MODEL.add({TenHocVien, Email, SoDienThoai, ThoiGianDangKi});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let { IDHocVien,TenHocVien, Email, SoDienThoai, ThoiGianDangKi} = req.body;
    try {
        let result = await HOCVIEN_MODEL.update({IDHocVien,TenHocVien, Email, SoDienThoai, ThoiGianDangKi});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDHocVien} = req.body;
    try {
        let result = await HOCVIEN_MODEL.delete(IDHocVien);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;