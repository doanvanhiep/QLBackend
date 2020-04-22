const route = require('express').Router();
const QUANTRI_MODEL = require('../models/QuanTri');

route.get('/danhsach', async (req, res) => {
    let result = await QUANTRI_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {HoTen,SoDienThoai,Email,DiaChi} = req.body;
    try {
        let result = await QUANTRI_MODEL.add({HoTen,SoDienThoai,Email,DiaChi});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDQuanTri,HoTen,SoDienThoai,Email,DiaChi} = req.body;
    try {
        let result = await QUANTRI_MODEL.update({IDQuanTri,HoTen,SoDienThoai,Email,DiaChi});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDQuanTri} = req.body;
    try {
        let result = await QUANTRI_MODEL.delete(IDQuanTri);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;