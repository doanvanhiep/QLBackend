const route = require('express').Router();
const LOPHOC_MODEL = require('../models/LopHoc');

route.get('/danhsach', async (req, res) => {
    let result = await LOPHOC_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {MaLopHoc,IDLopHocPhan,IDGiangVien,IDCaHoc,IDPhongHoc,IDThuTrongTuan,ThoiGianBatDau,ThoiGianKetThuc} = req.body;
    try {
        let result = await LOPHOC_MODEL.add({MaLopHoc,IDLopHocPhan,IDGiangVien,IDCaHoc,IDPhongHoc,IDThuTrongTuan,ThoiGianBatDau,ThoiGianKetThuc});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDLopHoc,MaLopHoc,IDLopHocPhan,IDGiangVien,IDCaHoc,IDPhongHoc,IDThuTrongTuan,ThoiGianBatDau,ThoiGianKetThuc} = req.body;
    try {
        let result = await LOPHOC_MODEL.update({IDLopHoc,MaLopHoc,IDLopHocPhan,IDGiangVien,IDCaHoc,IDPhongHoc,IDThuTrongTuan,ThoiGianBatDau,ThoiGianKetThuc});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDLopHoc} = req.body;
    try {
        let result = await LOPHOC_MODEL.delete(IDLopHoc);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;