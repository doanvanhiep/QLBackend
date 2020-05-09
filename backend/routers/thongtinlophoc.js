const route = require('express').Router();
const THONTINLOPHOC_MODEL = require('../models/ThongTinLopHoc');

route.get('/thoikhoabieu/:IDGiangVien', async (req, res) => {
    let IDGiangVien=req.params.IDGiangVien;
    let result = await THONTINLOPHOC_MODEL.getSchedule(IDGiangVien);
    return res.json({result});
});
route.get('/danhsach', async (req, res) => {
    let result = await THONTINLOPHOC_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {IDLopHoc,CaHoc,Thu,IDPhongHoc,IDGiangVien} = req.body;
    try {
        let result = await THONTINLOPHOC_MODEL.add({IDLopHoc,CaHoc,Thu,IDPhongHoc,IDGiangVien});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDThongTinLopHoc,CaHoc,Thu,IDPhongHoc,IDGiangVien} = req.body;
    try {
        let result = await THONTINLOPHOC_MODEL.update({IDThongTinLopHoc,CaHoc,Thu,IDPhongHoc,IDGiangVien});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDThongTinLopHoc} = req.body;
    try {
        let result = await THONTINLOPHOC_MODEL.delete(IDThongTinLopHoc);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/suatrangthai', async (req, res) => {
    let {IDThongTinLopHoc,TrangThai} = req.body;
    try {
        let result = await THONTINLOPHOC_MODEL.updatestatus({IDThongTinLopHoc,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;