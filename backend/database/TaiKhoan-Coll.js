const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var TaiKhoanSchema = new Shema ({
    IDTaiKhoan: Number,
    TenTaiKhoan: String,
    MatKhau: String,
    Quyen:String,
    TrangThai:String
});
var TaiKhoanModel = mongoose.model('taikhoan', TaiKhoanSchema);
module.exports = TaiKhoanModel;

//Tên tài khoản format  nv/admin + number, default password sẽ là Tên tài khoản + sdt
