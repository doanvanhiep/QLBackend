const route = require('express').Router();
const THUTRONGTUAN_MODEL = require('../models/ThuTrongTuan');

route.get('/danhsach', async (req, res) => {
    let result = await THUTRONGTUAN_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {ThuTrongTuan,SoNgay,GhiChu} = req.body;
    try {
        let result = await THUTRONGTUAN_MODEL.add({ThuTrongTuan,SoNgay,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDThuTrongTuan,ThuTrongTuan,SoNgay,GhiChu} = req.body;
    try {
        let result = await THUTRONGTUAN_MODEL.update({IDThuTrongTuan,ThuTrongTuan,SoNgay,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDThuTrongTuan} = req.body;
    try {
        let result = await THUTRONGTUAN_MODEL.delete(IDThuTrongTuan);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;