const route = require('express').Router();
const BAONGHI_MODEL = require('../models/BaoNghi');
route.get('/danhsach', async (req, res) => {
    let result = await BAONGHI_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {IDGiangVien,IDLopHoc,IDPhongHoc,IDThongTinLopHoc,NgayNghi,GhiChu} = req.body;
    try {
        let result = await BAONGHI_MODEL.add({IDGiangVien,IDLopHoc,IDPhongHoc,IDThongTinLopHoc,NgayNghi,GhiChu});
        return res.json({"result":result})
    } catch (error) {
        return res.json({"result":result})
    }
});
route.put('/sua/:IDBaoNghi', async (req, res) => {
    let IDBaoNghi=req.params.IDBaoNghi;
    let {IDLopHoc,IDPhongHoc,IDThongTinLopHoc,NgayNghi,GhiChu} = req.body;
    try {
        let result = await BAONGHI_MODEL.update({IDBaoNghi,IDLopHoc,IDPhongHoc,IDThongTinLopHoc,NgayNghi,GhiChu});
        return res.json({"result":result})
    } catch (error) {
        return res.json({"result":result})
    }
});
route.delete('/xoa/:IDBaoNghi', async (req, res) => {
    let IDBaoNghi =req.params.IDBaoNghi;
    try {
        let result = await BAONGHI_MODEL.delete(IDBaoNghi);
        return res.json({"result":result})
    } catch (error) {
        return res.json({"result":result})
    }
});
route.put('/suatrangthai', async (req, res) => {
    let {IDBaoNghi,TrangThai} = req.body;
    try {
        let result = await BAONGHI_MODEL.updateStatus({IDBaoNghi,TrangThai});
        return res.json({"result":result})
    } catch (error) {
        return res.json({"result":result})
    }
});
module.exports = route;