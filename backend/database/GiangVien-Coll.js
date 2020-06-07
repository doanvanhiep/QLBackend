const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var GiangVienSchema = new Shema ({
    IDGiangVien: Number,
    TenTaiKhoan:String,
    HoTen: String,
    DiaChi: String,
    SoDienThoai: String,
    Email: String,
    MoTa: String,
    HinhAnh: String,
    GhiChu:String,
    TrangThai:Number
});
var GiangVienModel = mongoose.model('giangvien', GiangVienSchema);
module.exports = GiangVienModel;