const route = require('express').Router();
const TAIKHOAN_MODEL = require('../models/TaiKhoan');

route.get('/danhsach', async (req, res) => {
    let result = await TAIKHOAN_MODEL.getList();
    return res.json({result});
});
route.get('/getquyentaikhoan/:token', async (req, res) => {
    let token =req.params.token;
    let result = await TAIKHOAN_MODEL.getQuyenTenTaiKhoanByToken(token);
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {TenTaiKhoan,MatKhau,Quyen} = req.body;
    try {
        let result = await TAIKHOAN_MODEL.add({TenTaiKhoan,MatKhau,Quyen});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/doimatkhau', async (req, res) => {
    let {TenTaiKhoan,MatKhauCu,MatKhauMoi} = req.body;
    try {
        let result = await TAIKHOAN_MODEL.changePassword({TenTaiKhoan,MatKhauCu,MatKhauMoi});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDTaiKhoan,IDQuanTri,TenTaiKhoan,MatKhau,Quyen,TrangThai} = req.body;
    try {
        let result = await TAIKHOAN_MODEL.update({IDTaiKhoan,IDQuanTri,TenTaiKhoan,MatKhau,Quyen,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDTaiKhoan} = req.body;
    try {
        let result = await TAIKHOAN_MODEL.delete(IDTaiKhoan);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/suatrangthai', async (req, res) => {
    let {IDTaiKhoan,IDQuanTri,TrangThai} = req.body;
    try {
        let result = await TAIKHOAN_MODEL.updateStatus({IDTaiKhoan,IDQuanTri,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

module.exports = route;