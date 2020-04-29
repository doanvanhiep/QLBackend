const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var KhoaHocSchema = new Shema ({
    IDKhoaHoc: Number,
    TenKhoaHoc: String,
    GhiChu: String,
    TrangThai:Number
});
var KhoaHocModel = mongoose.model('khoahoc', KhoaHocSchema);
module.exports = KhoaHocModel;