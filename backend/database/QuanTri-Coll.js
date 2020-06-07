const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var QuanTriSchema = new Shema ({
    IDQuanTri: Number,
    TenTaiKhoan:String,
    HoTen: String,
    SoDienThoai: String,
    Email:String,
    DiaChi:String
});
var QuanTriModel = mongoose.model('quantri', QuanTriSchema);
module.exports = QuanTriModel;
