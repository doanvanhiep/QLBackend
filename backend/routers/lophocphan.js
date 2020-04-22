const route = require('express').Router();
const LOPHOCPHAN_MODEL = require('../models/LopHocPhan');

route.get('/danhsach', async (req, res) => {
    let result = await LOPHOCPHAN_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,TongSoGio,HocPhi,GhiChu} = req.body;
    try {
        let result = await LOPHOCPHAN_MODEL.add({IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,TongSoGio,HocPhi,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDLopHocPhan,IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,TongSoGio,HocPhi,GhiChu} = req.body;
    try {
        let result = await LOPHOCPHAN_MODEL.update({IDLopHocPhan,IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,TongSoGio,HocPhi,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDLopHocPhan} = req.body;
    try {
        let result = await LOPHOCPHAN_MODEL.delete(IDLopHocPhan);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;