const route = require('express').Router();
const CHITIETLOPHOC_MODEL = require('../models/ChiTietLopHoc');

route.get('/danhsach', async (req, res) => {
    let result = await CHITIETLOPHOC_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {IDLopHoc,IDHocVien} = req.body;
    try {
        let result = await CHITIETLOPHOC_MODEL.add({IDLopHoc,IDHocVien});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDChiTietLopHoc,IDLopHoc,IDHocVien} = req.body;
    try {
        let result = await CHITIETLOPHOC_MODEL.update({IDChiTietLopHoc,IDLopHoc,IDHocVien});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDChiTietLopHoc} = req.body;
    try {
        let result = await CHITIETLOPHOC_MODEL.delete(IDChiTietLopHoc);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;