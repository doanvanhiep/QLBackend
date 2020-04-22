const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var HocVienSchema = new Shema ({
    IDHocVien: Number,
    TenHocVien: String,
    Email: String,
    SoDienThoai: String,
    ThoiGianDangKi:String
});
var HocVienModel = mongoose.model('hocvien', HocVienSchema);
module.exports = HocVienModel;