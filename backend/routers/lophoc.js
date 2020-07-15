const route = require('express').Router();
const LOPHOC_MODEL = require('../models/LopHoc');
const THONGTINLOPHOC_MODEL = require('../models/ThongTinLopHoc');
route.get('/danhsachlophoc/', async (req, res) => {
    let result = await LOPHOC_MODEL.getListLopHoc();
    return res.json({ result });
});
route.get('/checkgiangvienbaobu/:IDGiangVien/:CaHoc/:Thu/:NgayBu', async (req, res) => {
    let IDGiangVien = req.params.IDGiangVien;
    let CaHoc = req.params.CaHoc;
    let Thu = req.params.Thu;
    let NgayBu = req.params.NgayBu;
    let result = await LOPHOC_MODEL.checkGiangVienBaoBu(IDGiangVien,CaHoc,Thu,NgayBu);
    return res.json({ result });
});
route.get('/danhsachlophocbyidgiangvien/:IDGiangVien', async (req, res) => {
    let IDGiangVien = req.params.IDGiangVien;
    let result = await LOPHOC_MODEL.getListLopHocByIDGiangVien(IDGiangVien);
    return res.json({ result });
});
route.get('/getphonghocbaobu/:CaHoc/:Thu/:NgayBu', async (req, res) => {
    let CaHoc = req.params.CaHoc;
    let Thu = req.params.Thu;
    let NgayBu = req.params.NgayBu;
    let result = await LOPHOC_MODEL.getPhongHocBaoBu(CaHoc,Thu,NgayBu);
    return res.json({ result });
});
route.get('/danhsachbyidgiangvien/:IDGiangVien', async (req, res) => {
    let IDGiangVien = req.params.IDGiangVien;
    console.log(IDGiangVien);
    // let result = await LOPHOC_MODEL.getListLopHoc(IDLopHocPhan);
    // return res.json({ result });
});
route.get('/danhsach/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan = req.params.IDLopHocPhan;
    let result = await LOPHOC_MODEL.getListLopHocByIDLopHocPhan(IDLopHocPhan);
    return res.json({ result });
});
route.post('/checkphonghocgiangvien', async (req, res) => {
    let { BatDau, KetThuc, IDPhongHoc, IDGiangVien, CaHoc, Thu } = req.body;
    let result = await LOPHOC_MODEL.checkPhongHocVaGiangVien(BatDau, KetThuc, IDPhongHoc, IDGiangVien, CaHoc, Thu);
    return res.json({ result });
});
route.post('/checkarrayphgv', async (req, res) => {
    let { arrPHGV, BatDau, KetThuc } = req.body;
    for (let i = 0; i < arrPHGV.length; i++) {
        let result = await LOPHOC_MODEL.checkArrPHGV(BatDau, KetThuc, arrPHGV[i]);
        if (result.error) {
            return res.json({ error: true,result });
        }
        if (result.statusPH || result.statusGV) {
            let lh = arrPHGV[i];
            return res.json({ error: true,result, lh });
        }
    }
    return res.json({ error: false, message: "Không có lỗi" });
});
route.post('/recommendphonghocgiangvien', async (req, res) => {
    let { BatDau, KetThuc, CaHoc, Thu } = req.body;
    let result = await LOPHOC_MODEL.recommendPhongHocVaGiangVien(BatDau, KetThuc, CaHoc, Thu);
    return res.json({ result });
});
route.post('/them', async (req, res) => {
    let data = JSON.parse(req.body.data);
    let IDLopHocPhan = req.body.IDLopHocPhan;
    try {
        var result = await LOPHOC_MODEL.add(IDLopHocPhan, data.MaLopHoc, data.NgayKhaiGiang, data.NgayBeGiang, data.GhiChu);
        var IDLopHoc = result.data.IDLopHoc;
        const start = async () => {
            await asyncForEach(data.buoihocs, async (element) => {
                var Thu = element.thu;
                var CaHoc = element.ca;
                var IDPhongHoc = parseInt(element.phong, 10);
                var IDGiangVien = parseInt(element.giangvien, 10);
                await THONGTINLOPHOC_MODEL.add({ IDLopHoc, CaHoc, Thu, IDPhongHoc, IDGiangVien });
            });
            return res.json({ "TrangThai": result })
        }
        start();
    } catch (error) {
        return res.json({ "TrangThai": result })
    }
});
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
route.put('/sua/:IDLopHoc', async (req, res) => {
    var IDLopHoc = req.params.IDLopHoc;
    var data = JSON.parse(req.body.data);
    try {
        var result = await LOPHOC_MODEL.update(IDLopHoc, data.MaLopHoc, data.NgayKhaiGiang, data.NgayBeGiang, data.GhiChu);
        const start = async () => {
            await asyncForEach(data.buoihocs, async (element) => {
                var Thu = element.thu;
                var CaHoc = element.ca;
                var IDPhongHoc = parseInt(element.phong, 10);
                var IDGiangVien = parseInt(element.giangvien, 10);
                var IDThongTinLopHoc = parseInt(element.idTTLH, 10);
                await THONGTINLOPHOC_MODEL.update({ IDThongTinLopHoc, CaHoc, Thu, IDPhongHoc, IDGiangVien });
            });
            return res.json({ "TrangThai": result })
        }
        start();
    } catch (error) {
        return res.json({ "TrangThai": result })
    }
});
route.put('/suatrangthai', async (req, res) => {
    let { IDLopHoc, TrangThai } = req.body;
    try {
        var result = await LOPHOC_MODEL.updatestatus(IDLopHoc, TrangThai);
        return res.json({ "TrangThai": result });
    } catch (error) {
        return res.json({ "TrangThai": result })
    }
});
route.delete('/xoa/:IDLopHoc', async (req, res) => {
    var IDLopHoc = req.params.IDLopHoc;
    try {
        let result = await LOPHOC_MODEL.delete(IDLopHoc);
        return res.json({ "TrangThai": result })
    } catch (error) {
        return res.json({ "TrangThai": result })
    }
});


module.exports = route;