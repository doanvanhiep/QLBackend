const route = require('express').Router();
const KHOAHOC_MODEL = require('../models/KhoaHoc');

route.get('/danhsach', async (req, res) => {
    let result = await KHOAHOC_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let { TenKhoaHoc,MoTa} = req.body;
    try {
        let result = await KHOAHOC_MODEL.add({ TenKhoaHoc,MoTa});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let { IDKhoaHoc,TenKhoaHoc,MoTa} = req.body;
    try {
        let result = await KHOAHOC_MODEL.update({ IDKhoaHoc,TenKhoaHoc,MoTa});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDKhoaHoc} = req.body;
    try {
        let result = await KHOAHOC_MODEL.delete(IDKhoaHoc);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;