const BAOBU_MODEL = require('../database/BaoBu-Coll');

module.exports = class BaoBu extends BAOBU_MODEL {

    static getbaobuchecklophoc(IDGiangVien,IDPhong,CaHoc,Thu, BatDau, KetThuc) {
        return new Promise(async resolve => {
            try {
                let dataPH = await BAOBU_MODEL.aggregate([
                    {
                        $match:
                        {
                            $and: [
                                { CaHoc:CaHoc},
                                { Thu: Thu },
                                { IDPhongHoc: parseInt(IDPhong,10) },
                                { NgayBu: { "$lte": KetThuc } },             //ngày bù <= ngày kết thúc của tuần
                                { NgayBu: { "$gte": BatDau } },                 // ngày bù >= ngày bắt đầu của tuần
                            ]
                        }
                    }
                ]);

                let dataGV= await BAOBU_MODEL.aggregate([
                    {
                        $match:
                        {
                            $and: [
                                { CaHoc:CaHoc},
                                { Thu: Thu },
                                { IDGiangVien: parseInt(IDGiangVien,10) },
                                { NgayBu: { "$lte": KetThuc } },             //ngày bù <= ngày kết thúc của tuần
                                { NgayBu: { "$gte": BatDau } },                 // ngày bù >= ngày bắt đầu của tuần
                            ]
                        }
                    }
                ]);
                if (!dataPH || !dataPH)
                    return resolve({ error: true, message: 'Không thể lấy danh sách báo bù' });
                return resolve({ error: false, dataPH: dataPH,dataGV: dataGV })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }


    static getbaobutheothoikhoabieu(IDGiangVien, BatDau, KetThuc) {
        return new Promise(async resolve => {
            try {
                let data = await BAOBU_MODEL.aggregate([
                    {
                        $match:
                        {
                            $and: [
                                { IDGiangVien: parseInt(IDGiangVien,10) },
                                { NgayBu: { "$lte": KetThuc } },             //ngày bù <= ngày kết thúc của tuần
                                { NgayBu: { "$gte": BatDau } },                 // ngày bù >= ngày bắt đầu của tuần
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'phonghocs',
                            localField: 'IDPhongHoc',
                            foreignField: 'IDPhongHoc',
                            as: 'ph'
                        }
                    },
                    { $unwind: "$ph" },
                    {
                        $match:
                            { "ph.TrangThai": 1 }
                    },
                    {
                        $lookup: {
                            from: 'lophocs',
                            localField: 'IDLopHoc',
                            foreignField: 'IDLopHoc',
                            as: 'lh'
                        }
                    },
                    { $unwind: "$lh" },
                    {
                        $match:
                            { "lh.TrangThai": 1 }
                    },
                    {
                        $lookup: {
                            from: 'lophocphans',
                            localField: 'lh.IDLopHocPhan',
                            foreignField: 'IDLopHocPhan',
                            as: 'lhp'
                        }
                    },
                    { $unwind: "$lhp" },
                    {
                        $match:
                            { "lhp.TrangThai": 1 }
                    },
                    {
                        $project:
                        {
                            CaHoc: 1,
                            Thu: 1,
                            TenPhong:"$ph.TenPhong",
                            TenLopHocPhan:"$lhp.TenLopHocPhan"
                        }
                    }
                ]);
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách báo bù' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await BAOBU_MODEL.aggregate([
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
                        $lookup: {
                            from: 'phonghocs',
                            localField: 'IDPhongHoc',
                            foreignField: 'IDPhongHoc',
                            as: 'PhongHoc'
                        }
                    },
                    { $unwind: "$PhongHoc" },
                    {
                        $match:
                            { "PhongHoc.TrangThai": 1 }
                    },
                    {
                        $project:
                        {
                            IDBaoBu: 1,
                            IDGiangVien: 1,
                            IDLopHoc: 1,
                            IDPhongHoc: 1,
                            CaHoc: 1,
                            Thu:1,
                            NgayBu: 1,
                            GhiChu: 1,
                            TrangThai: 1,
                            BuoiNghi: 1,
                            MaLopHoc: "$LopHoc.MaLopHoc",
                            TenLopHocPhan: "$LopHocPhan.TenLopHocPhan",
                            GiangVien: "$GiangVien.HoTen",
                            PhongHoc:"$PhongHoc.TenPhong"
                        }
                    }
                ]);
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách báo bù' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static add({ IDGiangVien, IDLopHoc, IDPhongHoc, CaHoc,Thu, NgayBu, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let lastBaoBu = await BAOBU_MODEL.findOne().sort({ IDBaoBu: -1 });
                let IDBaoBu = 1;
                let TrangThai = 0;
                if (lastBaoBu != null) {
                    IDBaoBu = lastBaoBu.IDBaoBu + 1;
                }
                let BaoBu = new BAOBU_MODEL({ IDBaoBu, IDGiangVien, IDLopHoc, IDPhongHoc, CaHoc,Thu, NgayBu, GhiChu, TrangThai });
                let saveBaoBu = await BaoBu.save();
                if (!saveBaoBu) return resolve({ error: true, message: 'Không thể thêm lớp báo bù' });
                resolve({ error: false, data: BaoBu });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({ IDBaoBu, IDLopHoc, IDPhongHoc, CaHoc,Thu, NgayBu, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let checkID = await BAOBU_MODEL.findOne({ IDBaoBu: IDBaoBu });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy báo bù để sửa' });
                let updateID = await BAOBU_MODEL.findOneAndUpdate({ IDBaoBu: IDBaoBu }, { IDLopHoc, IDPhongHoc, CaHoc,Thu, NgayBu,  GhiChu }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDBaoBu) {

        return new Promise(async resolve => {
            try {
                let checkID = await BAOBU_MODEL.findOne({ IDBaoBu: IDBaoBu })
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy báo bù để xóa' });
                let deleteBaoBu = await BAOBU_MODEL.findOneAndDelete({ IDBaoBu: IDBaoBu });
                resolve({ error: false, data: deleteBaoBu })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static updateStatus({ IDBaoBu, TrangThai }) {
        return new Promise(async resolve => {
            try {
                let checkID = await BAOBU_MODEL.findOne({ IDBaoBu: IDBaoBu });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy báo bù để sửa' });
                let updateID = await BAOBU_MODEL.findOneAndUpdate({ IDBaoBu: IDBaoBu }, { TrangThai }, { new: true });
                resolve({ error: false, data: updateID })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}