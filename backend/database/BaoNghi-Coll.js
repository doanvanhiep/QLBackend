const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var BaoNghiSchema = new Shema ({
    IDBaoNghi: Number,
    IDGiangVien: Number,
    IDLopHoc: Number,
    IDPhongHoc:Number,
    IDThongTinLopHoc: Number,
    NgayNghi:String,
    GhiChu: String,
    TrangThai:Number
});
var BaoNghiModel = mongoose.model('baonghi', BaoNghiSchema);
module.exports = BaoNghiModel;