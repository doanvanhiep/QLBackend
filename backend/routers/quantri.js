const route = require('express').Router();
const QUANTRI_MODEL = require('../models/QuanTri');

route.get('/danhsach', async (req, res) => {
    let result = await QUANTRI_MODEL.getList();
    return res.json({result});
});
route.get('/getthongtinbytentaikhoan/:TenTaiKhoan', async (req, res) => {
    let TenTaiKhoan=req.params.TenTaiKhoan;
    let result = await QUANTRI_MODEL.getThongTinByTenTaiKhoan(TenTaiKhoan);
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
route.put('/suatrangthai', async (req, res) => {
    let {IDQuanTri,TrangThai} = req.body;
    try {
        let result = await QUANTRI_MODEL.UpdateState(IDQuanTri,TrangThai);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/suathongtincanhan', async (req, res) => {
    let {TenTaiKhoan,HoTen, DiaChi, SoDienThoai, Email, HinhAnh} = req.body;
    try {
        let result = await QUANTRI_MODEL.updateThongTinCaNhan({TenTaiKhoan,HoTen, DiaChi, SoDienThoai, Email, HinhAnh});
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