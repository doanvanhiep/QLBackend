const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var LopHocSchema = new Shema ({
    IDLopHoc: Number,
    IDLopHocPhan: Number,
    MaLopHoc: String,
    NgayKhaiGiang:String,
    NgayBeGiang:String,
    GhiChu:String,
    TrangThai:Number
});
var LopHocModel = mongoose.model('lophoc', LopHocSchema);
module.exports = LopHocModel;
