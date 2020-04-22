const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var ThuTrongTuanSchema = new Shema ({
    IDThuTrongTuan: Number,
    ThuTrongTuan: String,
    SoNgay: Number,
    GhiChu:String
});
var ThuTrongTuanModel = mongoose.model('thutrongtuan', ThuTrongTuanSchema);
module.exports = ThuTrongTuanModel;
