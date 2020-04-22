const mongoose = require('mongoose');
var Shema = mongoose.Schema;
var ChiTietLopHocSchema = new Shema ({
    IDChiTietLopHoc:Number,
    IDLopHoc: Number,
    IDHocVien:Number
});
var ChiTietLopHocModel = mongoose.model('chitietlophoc', ChiTietLopHocSchema);
module.exports = ChiTietLopHocModel;
