const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var LienHeSchema = new Shema ({
    IDLienHe: Number,
    HoTen: String,
    Email: String,
    SoDienThoai: String,
    NoiDung: String,
    ThoiGian:String,
    ThongTinCapNhap:String,
    TrangThai:Number
});
var LienHeModel = mongoose.model('lienhe', LienHeSchema);
module.exports = LienHeModel;