const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var BaoBuSchema = new Shema ({
    IDBaoBu: Number,
    IDGiangVien: Number,
    IDLopHoc: Number,
    IDPhongHoc:Number,
    CaHoc:String,
    Thu:String,
    NgayBu:String,
    GhiChu: String,
    TrangThai:Number
});
var BaoBuModel = mongoose.model('baobu', BaoBuSchema);
module.exports = BaoBuModel;