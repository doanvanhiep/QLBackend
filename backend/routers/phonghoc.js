const route = require('express').Router();
const PHONGHOC_MODEL = require('../models/PhongHoc');
route.get('/danhsach', async (req, res) => {
    let result = await PHONGHOC_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {TenPhong,SoChoNgoi,GhiChu} = req.body;
    try {
        let result = await PHONGHOC_MODEL.add({TenPhong,SoChoNgoi,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua/:IDPhongHoc', async (req, res) => {
    let IDPhongHoc=req.params.IDPhongHoc;
    let {TenPhong,SoChoNgoi,GhiChu} = req.body;
    try {
        let result = await PHONGHOC_MODEL.update({IDPhongHoc,TenPhong,SoChoNgoi,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/suatrangthai', async (req, res) => {
    let {IDPhongHoc,TrangThai} = req.body;
    try {
        let result = await PHONGHOC_MODEL.updateState(IDPhongHoc,TrangThai);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa/:IDPhongHoc', async (req, res) => {
    let  IDPhongHoc  = req.params.IDPhongHoc;
    try {
        let result = await PHONGHOC_MODEL.delete(IDPhongHoc);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;