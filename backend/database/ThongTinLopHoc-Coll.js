const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var ThongTinLopHocSchema = new Shema ({
    IDThongTinLopHoc:Number,
    IDLopHoc: Number,
    CaHoc: String,
    Thu: String,
    IDPhongHoc:Number,
    IDGiangVien:Number,
    TrangThai:Number
});
var ThongTinLopHocModel = mongoose.model('thongtinlophoc', ThongTinLopHocSchema);
module.exports = ThongTinLopHocModel;
