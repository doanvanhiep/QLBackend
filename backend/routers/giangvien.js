const route = require('express').Router();
const GIANGVIEN_MODEL = require('../models/GiangVien');

route.get('/danhsach', async (req, res) => {
    let result = await GIANGVIEN_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let { HoTen, DiaChi, SoDienThoai, Email,MoTa,HinhAnh,GhiChu} = req.body;
    try {
        let result = await GIANGVIEN_MODEL.add({HoTen, DiaChi, SoDienThoai, Email,MoTa,HinhAnh,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua/:IDGiangVien', async (req, res) => {
    let IDGiangVien=req.params.IDGiangVien;
    let { HoTen, DiaChi, SoDienThoai, Email,MoTa,HinhAnh,GhiChu} = req.body;
    try {
        let result = await GIANGVIEN_MODEL.update({IDGiangVien,HoTen, DiaChi, SoDienThoai, Email,MoTa,HinhAnh,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa/:IDGiangVien', async (req, res) => {
    let IDGiangVien=req.params.IDGiangVien;
    try {
        let result = await GIANGVIEN_MODEL.delete(IDGiangVien);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/xoa', async (req, res) => {
    let { IDGiangVien,TrangThai} = req.body;
    try {
        let result = await GIANGVIEN_MODEL.UpdateState(IDGiangVien,TrangThai);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;