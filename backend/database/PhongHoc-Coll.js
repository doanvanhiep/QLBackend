const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var PhongHocSchema = new Shema ({
    IDPhongHoc: Number,
    TenPhong: String,
    SoChoNgoi: Number,
    GhiChu: String,
    TrangThai: Number
});
var PhongHocModel = mongoose.model('phonghoc', PhongHocSchema);
module.exports = PhongHocModel;