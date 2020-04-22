const route = require('express').Router();
const LIENHE_MODEL = require('../models/LienHe');

route.get('/danhsach', async (req, res) => {
    let result = await LIENHE_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {HoTen,Email,SoDienThoai,NoiDung} = req.body;
    try {
        let result = await LIENHE_MODEL.add({HoTen,Email,SoDienThoai,NoiDung});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDLienHe,HoTen,Email,SoDienThoai,NoiDung,TrangThai} = req.body;
    try {
        let result = await LIENHE_MODEL.update({IDLienHe,HoTen,Email,SoDienThoai,NoiDung,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDLienHe} = req.body;
    try {
        let result = await LIENHE_MODEL.delete(IDLienHe);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/suatrangthai', async (req, res) => {
    let { IDLienHe,TrangThai} = req.body;
    try {
        let result = await LIENHE_MODEL.updateStatus({IDLienHe,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

module.exports = route;