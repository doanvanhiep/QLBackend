const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var CaHocSchema = new Shema ({
    IDCaHoc: Number,
    TenCa: String,
    GioBatDau: String,
    GioKetThuc: String,
    GhiChu: String
});
var CaHocModel = mongoose.model('cahoc', CaHocSchema);
module.exports = CaHocModel;