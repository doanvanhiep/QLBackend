const route = require('express').Router();
const GIANGVIEN_MODEL = require('../models/GiangVien');

route.get('/danhsach', async (req, res) => {
    let result = await GIANGVIEN_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let { HoTen, DiaChi, SoDienThoai, Email, GhiChu} = req.body;
    try {
        let result = await GIANGVIEN_MODEL.add({HoTen,DiaChi,SoDienThoai,Email,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let { IDGiangVien,HoTen, DiaChi, SoDienThoai, Email, GhiChu,TrangThai} = req.body;
    try {
        let result = await GIANGVIEN_MODEL.update({IDGiangVien,HoTen,DiaChi,SoDienThoai,Email,GhiChu,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDGiangVien} = req.body;
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