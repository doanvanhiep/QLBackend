const route = require('express').Router();
const LIENHE_MODEL = require('../models/LienHe');
function getCurrentDate()
{
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth() + 1; //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var seconds = currentDate.getSeconds();
    var minutes = currentDate.getMinutes();
    var hour = currentDate.getHours();
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    let res = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds;
    return res;
}
route.get('/danhsach', async (req, res) => {
    let result = await LIENHE_MODEL.getList();
    return res.json({result});
});
route.post('/them', async (req, res) => {
    let {HoTen,Email,SoDienThoai,NoiDung} = req.body;
    let ThoiGian = getCurrentDate();
    try {
        let result = await LIENHE_MODEL.add({HoTen,Email,SoDienThoai,NoiDung,ThoiGian});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

route.put('/sua', async (req, res) => {
    let {IDLienHe,HoTen,Email,SoDienThoai,NoiDung,TrangThai} = req.body;
    try {
        let result = await LIENHE_MODEL.update({IDLienHe,HoTen,Email,SoDienThoai,NoiDung,TrangThai});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.delete('/xoa', async (req, res) => {
    let { IDLienHe} = req.body;
    try {
        let result = await LIENHE_MODEL.delete(IDLienHe);
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});
route.put('/suatrangthai', async (req, res) => {
    let { IDLienHe,TrangThai,NguoiSua} = req.body;
    let ThongTinCapNhap=NguoiSua+" + "+getCurrentDate();
    try {
        let result = await LIENHE_MODEL.updateStatus({IDLienHe,TrangThai,ThongTinCapNhap});
        return res.json({"TrangThai":result})
    } catch (error) {
        return res.json({"TrangThai":result})
    }
});

module.exports = route;