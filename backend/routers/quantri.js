const route = require('express').Router();
const QUANTRI_MODEL = require('../models/QuanTri');

route.get('/danhsach', async (req, res) => {
    let result = await QUANTRI_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {HoTen, DiaChi, SoDienThoai, Email, HinhAnh, GhiChu} = req.body;
    try {
        let result = await QUANTRI_MODEL.add({HoTen, DiaChi, SoDienThoai, Email, HinhAnh, GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDQuanTri,HoTen, DiaChi, SoDienThoai, Email, HinhAnh, GhiChu} = req.body;
    try {
        let result = await QUANTRI_MODEL.update({IDQuanTri,HoTen, DiaChi, SoDienThoai, Email, HinhAnh, GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa/:IDQuanTri', async (req, res) => {
    let IDQuanTri = req.params.IDQuanTri;
    console.log(IDQuanTri);
    try {
        let result = await QUANTRI_MODEL.delete(IDQuanTri);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;