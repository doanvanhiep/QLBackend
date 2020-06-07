const route = require('express').Router();
const LOPHOC_MODEL = require('../models/LopHoc');
const THONGTINLOPHOC_MODEL = require('../models/ThongTinLopHoc');
route.get('/danhsachlophoc/', async (req, res) => {
    let result = await LOPHOC_MODEL.getListLopHoc();
    return res.json({ result });
});
route.get('/danhsachbyidgiangvien/:IDGiangVien', async (req, res) => {
    let IDGiangVien=req.params.IDGiangVien;
    console.log(IDGiangVien);
    // let result = await LOPHOC_MODEL.getListLopHoc(IDLopHocPhan);
    // return res.json({ result });
});
route.get('/danhsach/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan = req.params.IDLopHocPhan;
    let result = await LOPHOC_MODEL.getListLopHocByIDLopHocPhan(IDLopHocPhan);
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
                var IDThongTinLopHoc=parseInt(element.idTTLH, 10);
                await THONGTINLOPHOC_MODEL.update({ IDThongTinLopHoc, CaHoc, Thu, IDPhongHoc, IDGiangVien });
            });
            return res.json({ "TrangThai": result })
        }
        start();
    } catch (error) {
        return res.json({ "TrangThai": result })
    }
});
route.delete('/xoa/:IDLopHoc', async (req, res) => {
    var  IDLopHoc=req.params.IDLopHoc;
    try {
        let result = await LOPHOC_MODEL.delete(IDLopHoc);
        THONGTINLOPHOC_MODEL.delete(IDLopHoc);
        return res.json({ "TrangThai": result })
    } catch (error) {
        return res.json({ "TrangThai": result })
    }
});


module.exports = route;