const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var LopHocSchema = new Shema ({
    IDLopHoc: Number,
    MaLopHoc: String,
    IDLopHocPhan: Number,
    IDGiangVien: Number,
    IDCaHoc: Number,
    IDPhongHoc: Number,
    IDThuTrongTuan: Number,
    SiSo:Number,
    ThoiGianBatDau:String,
    ThoiGianKetThuc:String,
    TrangThai:Number
});
var LopHocModel = mongoose.model('lophoc', LopHocSchema);
module.exports = LopHocModel;
