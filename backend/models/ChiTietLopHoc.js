const CHITIETLOPHOC_MODEL = require('../database/ChiTietLopHoc-Coll');

module.exports = class ChiTietLopHoc extends CHITIETLOPHOC_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await CHITIETLOPHOC_MODEL.find();
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách chi tiết lớp học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({IDLopHoc,IDHocVien})
    {
        return new Promise(async resolve => {
            try {
                let lastChiTietLopHoc=await CHITIETLOPHOC_MODEL.findOne().sort({IDChiTietLopHoc:-1});
                let IDChiTietLopHoc=1;
                if(lastChiTietLopHoc!=null)
                {
                    IDChiTietLopHoc=lastChiTietLopHoc.IDChiTietLopHoc+1;
                }
                let ChiTietLopHoc = new CHITIETLOPHOC_MODEL({IDChiTietLopHoc,IDLopHoc,IDHocVien});
                let saveLopHoc = await ChiTietLopHoc.save();
                if (!saveLopHoc) return resolve({ error: true, message: 'Không thể thêm chi tiết lớp học' });
                resolve({ error: false, data: ChiTietLopHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDChiTietLopHoc,IDLopHoc,IDHocVien})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await CHITIETLOPHOC_MODEL.findOne({IDChiTietLopHoc:IDChiTietLopHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy chi tiết lớp học để sửa' });
                let updateID = await CHITIETLOPHOC_MODEL.findOneAndUpdate({ IDChiTietLopHoc: IDChiTietLopHoc }, {IDLopHoc,IDHocVien}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDChiTietLopHoc)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await CHITIETLOPHOC_MODEL.findOne({IDChiTietLopHoc:IDChiTietLopHoc})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy chi tiết lớp học để xóa'});
                let deleteLopHoc = await CHITIETLOPHOC_MODEL.findOneAndDelete({ IDChiTietLopHoc: IDChiTietLopHoc });
                resolve({ error: false, data: deleteLopHoc })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
}