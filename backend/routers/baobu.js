const route = require('express').Router();
const BAOBU_MODEL = require('../models/BaoBu');
// route.get('/getbaonghitheothoikhoabieu/:IDGiangVien/:BatDau/:KetThuc', async (req, res) => {
//     let IDGiangVien=req.params.IDGiangVien;
//     let BatDau=req.params.BatDau;
//     let KetThuc=req.params.KetThuc;
//     let result = await BAOBU_MODEL.getbaonghitheothoikhoabieu(IDGiangVien,BatDau,KetThuc);
//     return res.json({result});
// });
route.get('/danhsach', async (req, res) => {
    let result = await BAOBU_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {IDGiangVien, IDLopHoc, IDPhongHoc, CaHoc,Thu, NgayBu, GhiChu } = req.body;
    try {
        let result = await BAOBU_MODEL.add({IDGiangVien, IDLopHoc, IDPhongHoc, CaHoc,Thu, NgayBu, GhiChu });
        return res.json({"result":result})
    } catch (error) {
        return res.json({"result":result})
    }
});
route.put('/sua/:IDBaoBu', async (req, res) => {
    let IDBaoBu=req.params.IDBaoBu;
    let { IDLopHoc, IDPhongHoc, CaHoc,Thu, NgayBu, GhiChu} = req.body;
    try {
        let result = await BAOBU_MODEL.update({ IDBaoBu, IDLopHoc, IDPhongHoc, CaHoc,Thu, NgayBu, GhiChu});
        return res.json({"result":result})
    } catch (error) {
        return res.json({"result":result})
    }
});
route.delete('/xoa/:IDBaoBu', async (req, res) => {
    let IDBaoBu =req.params.IDBaoBu;
    try {
        let result = await BAOBU_MODEL.delete(IDBaoBu);
        return res.json({"result":result})
    } catch (error) {
        return res.json({"result":result})
    }
});
route.put('/suatrangthai', async (req, res) => {
    let {IDBaoBu,TrangThai} = req.body;
    try {
        let result = await BAOBU_MODEL.updateStatus({IDBaoBu,TrangThai});
        return res.json({"result":result})
    } catch (error) {
        return res.json({"result":result})
    }
});
module.exports = route;