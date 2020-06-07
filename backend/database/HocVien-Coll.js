const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var HocVienSchema = new Shema ({
    IDHocVien: Number,
    IDLopHoc:Number,
    TenHocVien: String,
    Email: String,
    SoDienThoai: String,
    ThoiGianDangKi:String,
    HinhThucThanhToan:String,
    SoTien:Number,
    TrangThaiThanhToan:Number,
    NguoiThem:String,
    TrangThai:Number
});
var HocVienModel = mongoose.model('hocvien', HocVienSchema);
module.exports = HocVienModel;