const KHOAHOC_MODEL = require('../database/KhoaHoc-Coll');
const LOPHOCPHAN_MODEL = require('../models/LopHocPhan');
const LOPHOC_MODELBD = require('../database/LopHocPhan-Coll');
module.exports = class KhoaHoc extends KHOAHOC_MODEL {
    static getKhoaHocByID(IDKhoaHoc) {
        return new Promise(async resolve => {
            try {
                let data = await KHOAHOC_MODEL.find({ TrangThai: 1, IDKhoaHoc: IDKhoaHoc }).select({ _id: 0 });
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách loại khóa học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await KHOAHOC_MODEL.find().select({ _id: 0 });
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách loại khóa học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getListallkhoahockichhoat() {
        return new Promise(async resolve => {
            try {
                let data = await KHOAHOC_MODEL.find({ TrangThai: 1 }).select({ _id: 0 });
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách loại khóa học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({ TenKhoaHoc, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let lastKhoaHoc = await KHOAHOC_MODEL.findOne().sort({ IDKhoaHoc: -1 });
                let IDKhoaHoc = 1;
                let TrangThai = 1;
                if (lastKhoaHoc != null) {
                    IDKhoaHoc = lastKhoaHoc.IDKhoaHoc + 1;
                }
                let KhoaHoc = new KHOAHOC_MODEL({ IDKhoaHoc, TenKhoaHoc, GhiChu, TrangThai });
                let saveKhoaHoc = await KhoaHoc.save();
                if (!saveKhoaHoc) return resolve({ error: true, message: 'Không thể thêm khóa học' });
                resolve({ error: false, data: KhoaHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({ IDKhoaHoc, TenKhoaHoc, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let checkID = await KHOAHOC_MODEL.findOne({ IDKhoaHoc: IDKhoaHoc });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy khóa học để sửa' });
                let updateID = await KHOAHOC_MODEL.findOneAndUpdate({ IDKhoaHoc: IDKhoaHoc }, { TenKhoaHoc, GhiChu }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDKhoaHoc) {
        return new Promise(async resolve => {
            try {
                let checkID = await KHOAHOC_MODEL.findOne({ IDKhoaHoc: IDKhoaHoc })
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy khóa học để xóa' });
                let deleteKhoaHoc = await KHOAHOC_MODEL.findOneAndDelete({ IDKhoaHoc: IDKhoaHoc });
                let listLHP = await LOPHOC_MODELBD.find({ IDKhoaHoc: IDKhoaHoc });
                const start = async () => {
                    if (listLHP.length > 0) {
                        await asyncForEach(listLHP, async (lhp) => {
                            await LOPHOCPHAN_MODEL.delete(lhp.IDLopHocPhan);
                        });
                    }
                    resolve({ error: false, data: deleteKhoaHoc })
                };
                start();
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static updatestatus({ IDKhoaHoc, TrangThai }) {
        return new Promise(async resolve => {
            try {
                let checkID = await KHOAHOC_MODEL.findOne({ IDKhoaHoc: IDKhoaHoc });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy khóa học để sửa' });
                let updateID = await KHOAHOC_MODEL.findOneAndUpdate({ IDKhoaHoc: IDKhoaHoc }, { TrangThai }, { new: true });
                let listLHP = await LOPHOC_MODELBD.find({ IDKhoaHoc: IDKhoaHoc });
                const start = async () => {
                    if (listLHP.length > 0) {
                        await asyncForEach(listLHP, async (lhp) => {
                            await LOPHOCPHAN_MODEL.updateStatus(lhp.IDLopHocPhan,TrangThai);
                        });
                    }
                    resolve({ error: false, data: updateID })
                };
                start();
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}