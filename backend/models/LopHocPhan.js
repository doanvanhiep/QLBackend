const LOPHOCPHAN_MODEL = require('../database/LopHocPhan-Coll');
const LOPHOC_MODEL = require('../models/LopHoc');
const LOPHOC_MODELBD = require('../database/LopHoc-Coll');
module.exports = class LopHocPhan extends LOPHOCPHAN_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await LOPHOCPHAN_MODEL.aggregate([
                    {
                        $match:
                        {
                            TrangThai: 1
                        }
                    },
                    {
                        $lookup: {
                            from: 'khoahocs',
                            localField: 'IDKhoaHoc',
                            foreignField: 'IDKhoaHoc',
                            as: 'TenKhoaHoc'
                        }
                    },
                    { $unwind: "$TenKhoaHoc" },
                    {
                        $project:
                        {
                            IDKhoaHoc: 1,
                            IDLopHocPhan: 1,
                            MaLopHocPhan: 1,
                            TenLopHocPhan: 1,
                            HocPhi: 1,
                            SoBuoi: 1,
                            SiSo: 1,
                            MoTa: 1,
                            HinhAnh: 1,
                            TenKhoaHoc: "$TenKhoaHoc.TenKhoaHoc"
                        }
                    }
                ]);
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách lớp học phần' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getListByIDKhoaHoc(IDKhoaHoc) {
        return new Promise(async resolve => {
            try {
                let data = await LOPHOCPHAN_MODEL.find({ TrangThai: 1, IDKhoaHoc: parseInt(IDKhoaHoc, 10) })
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách lớp học phần' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getLopHocPhanByID(IDLopHocPhan) {
        return new Promise(async resolve => {
            try {
                let data = await LOPHOCPHAN_MODEL.find({ IDLopHocPhan: IDLopHocPhan, TrangThai: 1 });
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách lớp học phần' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static add({ IDKhoaHoc, MaLopHocPhan, TenLopHocPhan, HocPhi, SoBuoi, SiSo, MoTa, HinhAnh, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let lastLopHocPhan = await LOPHOCPHAN_MODEL.findOne().sort({ IDLopHocPhan: -1 });
                let IDLopHocPhan = 1;
                let TrangThai = 1;
                if (lastLopHocPhan != null) {
                    IDLopHocPhan = lastLopHocPhan.IDLopHocPhan + 1;
                }
                let LopHocPhan = new LOPHOCPHAN_MODEL({ IDKhoaHoc, IDLopHocPhan, MaLopHocPhan, TenLopHocPhan, HocPhi, SoBuoi, SiSo, MoTa, HinhAnh, GhiChu, TrangThai });
                let saveLopHocPhan = await LopHocPhan.save();
                if (!saveLopHocPhan) return resolve({ error: true, message: 'Không thể thêm lớp học phần' });
                resolve({ error: false, data: LopHocPhan });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({ IDLopHocPhan, MaLopHocPhan, TenLopHocPhan, HocPhi, SoBuoi, SiSo, MoTa, HinhAnh, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let checkID = await LOPHOCPHAN_MODEL.findOne({ IDLopHocPhan: IDLopHocPhan });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học phần để sửa' });
                let updateID = await LOPHOCPHAN_MODEL.findOneAndUpdate({ IDLopHocPhan: IDLopHocPhan }, { MaLopHocPhan, TenLopHocPhan, HocPhi, SoBuoi, SiSo, MoTa, HinhAnh, GhiChu }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDLopHocPhan) {
        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }
        return new Promise(async resolve => {
            try {
                let checkID = await LOPHOCPHAN_MODEL.findOne({ IDLopHocPhan: IDLopHocPhan })
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học phần để xóa' });
                let deleteLopHocPhan = await LOPHOCPHAN_MODEL.findOneAndDelete({ IDLopHocPhan: IDLopHocPhan });
                let listLH = await LOPHOC_MODELBD.find({ IDLopHocPhan: IDLopHocPhan });
                const start = async () => {
                    if (listLH.length > 0) {
                        await asyncForEach(listLH, async (lh) => {
                            await LOPHOC_MODEL.delete(lh.IDLopHoc);
                        });
                    }
                    resolve({ error: false, data: deleteLopHocPhan })
                };
                start();
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static updateStatus({ IDLopHocPhan, TrangThai }) {
        return new Promise(async resolve => {
            try {
                let checkID = await LOPHOCPHAN_MODEL.findOne({ IDLopHocPhan: IDLopHocPhan });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học phần để sửa' });
                let updateID = await LOPHOCPHAN_MODEL.findOneAndUpdate({ IDLopHocPhan: IDLopHocPhan }, { TrangThai }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}