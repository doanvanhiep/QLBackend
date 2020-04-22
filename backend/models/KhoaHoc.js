const KHOAHOC_MODEL = require('../database/KhoaHoc-Coll');

module.exports = class KhoaHoc extends KHOAHOC_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await KHOAHOC_MODEL.find();
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách loại khóa học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({TenKhoaHoc, MoTa})
    {
        return new Promise(async resolve => {
            try {
                let lastKhoaHoc=await KHOAHOC_MODEL.findOne().sort({IDKhoaHoc:-1});
                let IDKhoaHoc=1;
                if(lastKhoaHoc!=null)
                {
                    IDKhoaHoc=lastKhoaHoc.IDKhoaHoc+1;
                }
                let LoaiKhoaHoc = new KHOAHOC_MODEL({IDKhoaHoc,TenKhoaHoc, MoTa});
                let saveKhoaHoc = await KhoaHoc.save();
                if (!saveKhoaHoc) return resolve({ error: true, message: 'Không thể thêm khóa học' });
                resolve({ error: false, data: KhoaHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDKhoaHoc,TenKhoaHoc,MoTa})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await KHOAHOC_MODEL.findOne({IDKhoaHoc:IDKhoaHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy khóa học để sửa' });
                let updateID = await KHOAHOC_MODEL.findOneAndUpdate({ IDKhoaHoc: IDKhoaHoc }, {TenKhoaHoc,MoTa}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDKhoaHoc)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await KHOAHOC_MODEL.findOne({IDKhoaHoc:IDKhoaHoc})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy khóa học để xóa'});
                let deleteKhoaHoc = await KHOAHOC_MODEL.findOneAndDelete({ IDKhoaHoc: IDKhoaHoc });
                resolve({ error: false, data: deleteLoaiKhoaHoc })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
}