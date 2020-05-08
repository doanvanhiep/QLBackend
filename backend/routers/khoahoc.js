const route = require('express').Router();
const KHOAHOC_MODEL = require('../models/KhoaHoc');

route.get('/danhsach', async (req, res) => {
    let result = await KHOAHOC_MODEL.getList();
    return res.json({result}); 
});
route.get('/getkhoahocbyid/:IDKhoaHoc', async (req, res) => {
    let IDKhoaHoc=req.params.IDKhoaHoc;
    let result = await KHOAHOC_MODEL.getKhoaHocByID(IDKhoaHoc);
    return res.json({result}); 
});
route.post('/them', async (req, res) => {
    let { TenKhoaHoc,GhiChu} = req.body;
    try {
        let result = await KHOAHOC_MODEL.add({ TenKhoaHoc,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua/:IDKhoaHoc', async (req, res) => {
    let IDKhoaHoc=req.params.IDKhoaHoc;
    let {TenKhoaHoc,GhiChu} = req.body;
    try {
        let result = await KHOAHOC_MODEL.update({ IDKhoaHoc,TenKhoaHoc,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa/:IDKhoaHoc', async (req, res) => {
    let IDKhoaHoc=req.params.IDKhoaHoc;
    try {
        let result = await KHOAHOC_MODEL.delete(IDKhoaHoc);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/sua', async (req, res) => {
    let { IDKhoaHoc,TrangThai} = req.body;
    try {
        let result = await KHOAHOC_MODEL.update({ IDKhoaHoc,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;