const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var LopHocPhanSchema = new Shema ({
    IDLopHocPhan: Number,
    IDKhoaHoc: Number,
    MaLopHocPhan: String,
    TenLopHocPhan: String,
    HocPhi:Number,
    SoBuoi:Number,
    SiSo:Number,
    MoTa:String,
    HinhAnh:String,
    GhiChu:String,
    TrangThai:Number
});
var LopHocPhanModel = mongoose.model('lophocphan', LopHocPhanSchema);
module.exports = LopHocPhanModel;
