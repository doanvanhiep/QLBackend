const route = require('express').Router();
const BAONGHI_MODEL = require('../models/BaoNghi');
route.get('/getbaonghitheothoikhoabieu/:IDGiangVien/:BatDau/:KetThuc', async (req, res) => {
    let IDGiangVien=req.params.IDGiangVien;
    let BatDau=req.params.BatDau;
    let KetThuc=req.params.KetThuc;
    let result = await BAONGHI_MODEL.getbaonghitheothoikhoabieu(IDGiangVien,BatDau,KetThuc);
    return res.json({result});
});
route.get('/getphbn/:CaHoc/:Thu/:Ngay', async (req, res) => {
    let CaHoc=req.params.CaHoc;
    let Thu=req.params.Thu;
    let Ngay=req.params.Ngay;
    let result = await BAONGHI_MODEL.getPHBN(CaHoc, Thu, Ngay);
    return res.json({result});
});
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