const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var KhoaHocSchema = new Shema ({
    IDKhoaHoc: Number,
    TenKhoaHoc: String,
    MoTa: String
});
var KhoaHocModel = mongoose.model('khoahoc', KhoaHocSchema);
module.exports = KhoaHocModel;