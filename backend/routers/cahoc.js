const route = require('express').Router();
const CAHOC_MODEL = require('../models/CaHoc');

route.get('/danhsach', async (req, res) => {
    let result = await CAHOC_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {TenCa,GioBatDau,GioKetThuc,GhiChu} = req.body;
    try {
        let result = await CAHOC_MODEL.add({TenCa,GioBatDau,GioKetThuc,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDCaHoc,TenCa,GioBatDau,GioKetThuc,GhiChu} = req.body;
    try {
        let result = await CAHOC_MODEL.update({IDCaHoc,TenCa,GioBatDau,GioKetThuc,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDCaHoc} = req.body;
    try {
        let result = await CAHOC_MODEL.delete(IDCaHoc);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;