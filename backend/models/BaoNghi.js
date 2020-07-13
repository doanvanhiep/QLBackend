const BAONGHI_MODEL = require('../database/BaoNghi-Coll');

module.exports = class BaoNghi extends BAONGHI_MODEL {
    static getbaonghitheothoikhoabieu(IDGiangVien, BatDau, KetThuc) {
        return new Promise(async resolve => {
            try {
                let data = await BAONGHI_MODEL.aggregate([
                    {
                        $match:
                        {
                            $and: [
                                { IDGiangVien: parseInt(IDGiangVien,10) },
                                { NgayNghi: { "$lte": KetThuc } },             //ngày nghỉ <= ngày kết thúc của tuần
                                { NgayNghi: { "$gte": BatDau } },                 // ngày nghỉ >= ngày bắt đầu của tuần
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'thongtinlophocs',
                            localField: 'IDThongTinLopHoc',
                            foreignField: 'IDThongTinLopHoc',
                            as: 'ThongTinLopHoc'
                        }
                    },
                    { $unwind: "$ThongTinLopHoc" },
                    {
                        $match:
                            { "ThongTinLopHoc.TrangThai": 1 }
                    },
                    {
                        $project:
                        {
                            CaHoc: "$ThongTinLopHoc.CaHoc",
                            Thu: "$ThongTinLopHoc.Thu"
                        }
                    }
                ]);
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách báo nghỉ' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await BAONGHI_MODEL.aggregate([
                    {
                        $lookup: {
                            from: 'giangviens',
                            localField: 'IDGiangVien',
                            foreignField: 'IDGiangVien',
                            as: 'GiangVien'
                        }
                    },
                    { $unwind: "$GiangVien" },
                    {
                        $match:
                            { "GiangVien.TrangThai": 1 }
                    },
                    {
                        $lookup: {
                            from: 'thongtinlophocs',
                            localField: 'IDThongTinLopHoc',
                            foreignField: 'IDThongTinLopHoc',
                            as: 'ThongTinLopHoc'
                        }
                    },
                    { $unwind: "$ThongTinLopHoc" },
                    {
                        $match:
                            { "ThongTinLopHoc.TrangThai": 1 }
                    },
                    {
                        $lookup: {
                            from: 'lophocs',
                            localField: 'IDLopHoc',
                            foreignField: 'IDLopHoc',
                            as: 'LopHoc'
                        }
                    },
                    { $unwind: "$LopHoc" },
                    {
                        $match:
                            { "LopHoc.TrangThai": 1 }
                    },
                    {
                        $lookup: {
                            from: 'lophocphans',
                            localField: 'LopHoc.IDLopHocPhan',
                            foreignField: 'IDLopHocPhan',
                            as: 'LopHocPhan'
                        }
                    },
                    { $unwind: "$LopHocPhan" },
                    {
                        $match:
                            { "LopHocPhan.TrangThai": 1 }
                    },
                    {
                        $project:
                        {
                            IDBaoNghi: 1,
                            IDGiangVien: 1,
                            IDLopHoc: 1,
                            IDPhongHoc: 1,
                            IDThongTinLopHoc: 1,
                            NgayNghi: 1,
                            GhiChu: 1,
                            TrangThai: 1,
                            BuoiNghi: 1,
                            MaLopHoc: "$LopHoc.MaLopHoc",
                            TenLopHocPhan: "$LopHocPhan.TenLopHocPhan",
                            GiangVien: "$GiangVien.HoTen",
                            Thu: "$ThongTinLopHoc.Thu",
                            CaHoc: "$ThongTinLopHoc.CaHoc"
                        }
                    }
                ]);
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách báo nghỉ' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({ IDGiangVien, IDLopHoc, IDPhongHoc, IDThongTinLopHoc, NgayNghi, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let lastBaoNghi = await BAONGHI_MODEL.findOne().sort({ IDBaoNghi: -1 });
                let IDBaoNghi = 1;
                let TrangThai = 0;
                if (lastBaoNghi != null) {
                    IDBaoNghi = lastBaoNghi.IDBaoNghi + 1;
                }
                let BaoNghi = new BAONGHI_MODEL({ IDBaoNghi, IDGiangVien, IDLopHoc, IDPhongHoc, IDThongTinLopHoc, NgayNghi, GhiChu, TrangThai });
                let saveBaoNghi = await BaoNghi.save();
                if (!saveBaoNghi) return resolve({ error: true, message: 'Không thể thêm lớp báo nghỉ' });
                resolve({ error: false, data: BaoNghi });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({ IDBaoNghi, IDLopHoc, IDPhongHoc, IDThongTinLopHoc, NgayNghi, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let checkID = await BAONGHI_MODEL.findOne({ IDBaoNghi: IDBaoNghi });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy báo nghỉ để sửa' });
                let updateID = await BAONGHI_MODEL.findOneAndUpdate({ IDBaoNghi: IDBaoNghi }, { IDLopHoc, IDPhongHoc, IDThongTinLopHoc, NgayNghi, GhiChu }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDBaoNghi) {

        return new Promise(async resolve => {
            try {
                let checkID = await BAONGHI_MODEL.findOne({ IDBaoNghi: IDBaoNghi })
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy báo nghỉ để xóa' });
                let deleteBaoNghi = await BAONGHI_MODEL.findOneAndDelete({ IDBaoNghi: IDBaoNghi });
                resolve({ error: false, data: deleteBaoNghi })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static updateStatus({ IDBaoNghi, TrangThai }) {
        return new Promise(async resolve => {
            try {
                let checkID = await BAONGHI_MODEL.findOne({ IDBaoNghi: IDBaoNghi });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy báo nghỉ để sửa' });
                let updateID = await BAONGHI_MODEL.findOneAndUpdate({ IDBaoNghi: IDBaoNghi }, { TrangThai }, { new: true });
                resolve({ error: false, data: updateID })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}