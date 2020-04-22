const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var TaiKhoanSchema = new Shema ({
    IDTaiKhoan: Number,
    IDQuanTri:Number,
    TenTaiKhoan: String,
    MatKhau: String,
    Quyen:String,
    TrangThai:String
});
var TaiKhoanModel = mongoose.model('taikhoan', TaiKhoanSchema);
module.exports = TaiKhoanModel;
