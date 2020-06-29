const PHONGHOC_MODEL = require('../database/PhongHoc-Coll');
const THONGTINLOPHOC_MODEL = require('../database/ThongTinLopHoc-Coll');
module.exports = class PhongHoc extends PHONGHOC_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await PHONGHOC_MODEL.find();
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách phòng học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({TenPhong,SoChoNgoi,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let lastPhongHoc=await PHONGHOC_MODEL.findOne().sort({IDPhongHoc:-1});
                let IDPhongHoc=1;
                if(lastPhongHoc!=null)
                {
                    IDPhongHoc=lastPhongHoc.IDPhongHoc+1;
                }
                let TrangThai=1;
                let PhongHoc = new PHONGHOC_MODEL({IDPhongHoc,TenPhong,SoChoNgoi,GhiChu,TrangThai});
                let savePhongHoc = await PhongHoc.save();
                if (!savePhongHoc) return resolve({ error: true, message: 'Không thể thêm phòng học' });
                resolve({ error: false, data: PhongHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDPhongHoc,TenPhong,SoChoNgoi,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await PHONGHOC_MODEL.findOne({IDPhongHoc:IDPhongHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy phòng học để sửa' });
                let updateID = await PHONGHOC_MODEL.findOneAndUpdate({ IDPhongHoc: IDPhongHoc }, {TenPhong,SoChoNgoi,GhiChu}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static updateState(IDPhongHoc,TrangThai)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await PHONGHOC_MODEL.findOne({IDPhongHoc:IDPhongHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy phòng học để sửa' });
                let updateID = await PHONGHOC_MODEL.findOneAndUpdate({ IDPhongHoc: IDPhongHoc }, {TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDPhongHoc)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await PHONGHOC_MODEL.findOne({IDPhongHoc:IDPhongHoc})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy phòng học để xóa'});
                let deletePhongHoc = await PHONGHOC_MODEL.findOneAndDelete({ IDPhongHoc: IDPhongHoc });
                await THONGTINLOPHOC_MODEL.deleteMany({ IDPhongHoc: IDPhongHoc });
                resolve({ error: false, data: deletePhongHoc })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
}