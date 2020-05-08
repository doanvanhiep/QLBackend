const route = require('express').Router();
const LOPHOCPHAN_MODEL = require('../models/LopHocPhan');

route.get('/danhsach', async (req, res) => {
    let result = await LOPHOCPHAN_MODEL.getList();
    return res.json({result});
});
route.get('/getlophocphanbyid/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan=req.params.IDLopHocPhan;
    let result = await LOPHOCPHAN_MODEL.getLopHocPhanByID(IDLopHocPhan);
    return res.json({result});
});
route.get('/danhsachbyidkhoahoc/:IDKhoaHoc', async (req, res) => {
    let IDKhoaHoc=req.params.IDKhoaHoc;
    let result = await LOPHOCPHAN_MODEL.getListByIDKhoaHoc(IDKhoaHoc);
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,HocPhi,SoBuoi,SiSo,MoTa,HinhAnh,GhiChu} = req.body;
    try {
        let result = await LOPHOCPHAN_MODEL.add({IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,HocPhi,SoBuoi,SiSo,MoTa,HinhAnh,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan=req.params.IDLopHocPhan;
    let {MaLopHocPhan,TenLopHocPhan,HocPhi,SoBuoi,SiSo,MoTa,HinhAnh,GhiChu} = req.body;
    try {
        let result = await LOPHOCPHAN_MODEL.update({IDLopHocPhan,MaLopHocPhan,TenLopHocPhan,HocPhi,SoBuoi,SiSo,MoTa,HinhAnh,GhiChu});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan =req.params.IDLopHocPhan;
    try {
        let result = await LOPHOCPHAN_MODEL.delete(IDLopHocPhan);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});


module.exports = route;