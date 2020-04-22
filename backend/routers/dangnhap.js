const route = require('express').Router();
const TAIKHOAN_MODEL = require('../models/TaiKhoan');
route.post('/dangnhap', async (req, res) => {
    let {TenTaiKhoan,MatKhau} = req.body;
    try {
        let result = await TAIKHOAN_MODEL.loginTaiKhoan({TenTaiKhoan,MatKhau});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

module.exports = route;