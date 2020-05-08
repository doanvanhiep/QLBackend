const THONGTINLOPHOC_MODEL = require('../database/ThongTinLopHoc-Coll');

module.exports = class ThongTinLopHoc extends THONGTINLOPHOC_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await THONGTINLOPHOC_MODEL.find({TrangThai:1});
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({IDLopHoc,CaHoc,Thu,IDPhongHoc,IDGiangVien})
    {
        return new Promise(async resolve => {
            try {
                let lastThongTinLopHoc=await THONGTINLOPHOC_MODEL.findOne().sort({IDThongTinLopHoc:-1});
                let IDThongTinLopHoc=1;
                let TrangThai=1;
                if(lastThongTinLopHoc!=null)
                {
                    IDThongTinLopHoc=lastThongTinLopHoc.IDThongTinLopHoc+1;
                }
                let ThongTinLopHoc = new THONGTINLOPHOC_MODEL({IDThongTinLopHoc,IDLopHoc,CaHoc,Thu,IDPhongHoc,IDGiangVien,TrangThai});
                let saveLopHoc = await ThongTinLopHoc.save();
                if (!saveLopHoc) return resolve({ error: true, message: 'Không thể thêm thông tin lớp học' });
                resolve({ error: false, data: ThongTinLopHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDThongTinLopHoc,CaHoc,Thu,IDPhongHoc,IDGiangVien})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await THONGTINLOPHOC_MODEL.findOne({IDThongTinLopHoc:IDThongTinLopHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy thông tin lớp học để sửa' });
                let updateID = await THONGTINLOPHOC_MODEL.findOneAndUpdate({ IDThongTinLopHoc: IDThongTinLopHoc }, {CaHoc,Thu,IDPhongHoc,IDGiangVien}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDLopHoc)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await THONGTINLOPHOC_MODEL.findOne({IDLopHoc:IDLopHoc})
                if (checkID==null) return resolve({ error: true, message: 'Không tìm thấy thông tin lớp học để xóa'});
                let deleteLopHoc = await THONGTINLOPHOC_MODEL.deleteMany({ IDLopHoc: IDLopHoc });
                resolve({ error: false, data: deleteLopHoc })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static updatestatus({IDLopHoc,TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await THONGTINLOPHOC_MODEL.findOne({IDLopHoc:IDLopHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy thông tin lớp học để sửa' });
                let updateID = await THONGTINLOPHOC_MODEL.findOneAndUpdate({ IDLopHoc: IDLopHoc }, {TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}