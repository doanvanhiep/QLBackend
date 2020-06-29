const HOCVIEN_MODEL = require('../database/HocVien-Coll');

module.exports = class HocVien extends HOCVIEN_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                //let data = await HOCVIEN_MODEL.find({ TrangThai: 1 }).sort({ ThoiGianDangKi: -1 })
                let data = await HOCVIEN_MODEL.aggregate([
                    {
                        $lookup: {
                            from: 'lophocs',
                            localField: 'IDLopHoc',
                            foreignField: 'IDLopHoc',
                            as: 'LH'
                        }
                    },
                    { $unwind: "$LH" },
                    {
                        $match:
                            { "LH.TrangThai": 1 }
                    },
                    {
                        $lookup: {
                            from: 'lophocphans',
                            localField: 'LH.IDLopHocPhan',
                            foreignField: 'IDLopHocPhan',
                            as: 'LHP'
                        }
                    },
                    { $unwind: "$LHP" },
                    {
                        $match:
                            { "LHP.TrangThai": 1 }
                    },
                    {
                        $project:
                        {
                            IDHocVien: 1,
                            IDLopHoc: 1,
                            TenHocVien:1,
                            Email: 1,
                            SoDienThoai: 1,
                            ThoiGianDangKi: 1,
                            HinhThucThanhToan: 1,
                            SoTien: 1,
                            TrangThaiThanhToan: 1,
                            TrangThai: 1,
                            IDLopHocPhan: "$LHP.IDLopHocPhan",
                            IDKhoaHoc: "$LHP.IDKhoaHoc",
                            //"LHP": "$LHP"
                        }
                    }
                ]);
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách học viên' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getListByIDLopHoc(IDLopHoc) {
        return new Promise(async resolve => {
            try {
                //let data = await HOCVIEN_MODEL.find({ TrangThai: 1 }).sort({ ThoiGianDangKi: -1 })
                let data = await HOCVIEN_MODEL.aggregate([
                    {
                        $match:
                        {
                            $and:[
                                {TrangThai: 1},
                                {IDLopHoc:parseInt(IDLopHoc,10)}
                            ]
                            
                        }
                    },
                    {
                        $lookup: {
                            from: 'lophocs',
                            localField: 'IDLopHoc',
                            foreignField: 'IDLopHoc',
                            as: 'LH'
                        }
                    },
                    { $unwind: "$LH" },
                    {
                        $match:
                            { "LH.TrangThai": 1 }
                    },
                    {
                        $lookup: {
                            from: 'lophocphans',
                            localField: 'LH.IDLopHocPhan',
                            foreignField: 'IDLopHocPhan',
                            as: 'LHP'
                        }
                    },
                    { $unwind: "$LHP" },
                    {
                        $match:
                            { "LHP.TrangThai": 1 }
                    },
                    {
                        $project:
                        {
                            IDHocVien: 1,
                            IDLopHoc: 1,
                            TenHocVien:1,
                            Email: 1,
                            SoDienThoai: 1,
                            ThoiGianDangKi: 1,
                            HinhThucThanhToan: 1,
                            SoTien: 1,
                            TrangThaiThanhToan: 1,
                            TrangThai: 1,
                            IDLopHocPhan: "$LHP.IDLopHocPhan",
                            IDKhoaHoc: "$LHP.IDKhoaHoc",
                            //"LHP": "$LHP"
                        }
                    }
                ]);
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách học viên' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static add({ IDLopHoc, TenHocVien, Email, SoDienThoai, ThoiGianDangKi, HinhThucThanhToan, SoTien, TrangThaiThanhToan, NguoiThem }) {
        return new Promise(async resolve => {
            try {
                let lastHV = await HOCVIEN_MODEL.findOne().sort({ IDHocVien: -1 });
                let IDHocVien = 1;
                if (lastHV != null) {
                    IDHocVien = lastHV.IDHocVien + 1;
                }
                let TrangThai = 1;
                let HocVien = new HOCVIEN_MODEL({ IDHocVien, IDLopHoc, TenHocVien, Email, SoDienThoai, ThoiGianDangKi, HinhThucThanhToan, SoTien, TrangThaiThanhToan, NguoiThem, TrangThai });
                let saveHocVien = await HocVien.save();
                if (!saveHocVien) return resolve({ error: true, message: 'Không thể thêm học viên' });
                resolve({ error: false, data: HocVien });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static updateStatusPay({ IDHocVien, IDLopHoc, TrangThaiThanhToan }) {
        return new Promise(async resolve => {
            try {
                let checkID = await HOCVIEN_MODEL.findOne({ IDHocVien: IDHocVien, IDLopHoc: IDLopHoc });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy học viên để sửa' });
                let updateID = await HOCVIEN_MODEL.findOneAndUpdate({ IDHocVien: IDHocVien , IDLopHoc: IDLopHoc}, { TrangThaiThanhToan }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static updateStatus({ IDHocVien, IDLopHoc, TrangThai }) {
        return new Promise(async resolve => {
            try {
                let checkID = await HOCVIEN_MODEL.findOne({ IDHocVien: IDHocVien, IDLopHoc: IDLopHoc });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy học viên để sửa' });
                let updateID = await HOCVIEN_MODEL.findOneAndUpdate({ IDHocVien: IDHocVien , IDLopHoc: IDLopHoc}, { TrangThai }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update( IDHocVien, IDLopHoc, TenHocVien,SoDienThoai,Email,IDLopHocCu ) {
        return new Promise(async resolve => {
            try {
                let checkID = await HOCVIEN_MODEL.findOne({ IDHocVien: IDHocVien, IDLopHoc: IDLopHocCu });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy học viên để sửa' });
                let updateID = await HOCVIEN_MODEL.findOneAndUpdate({ IDHocVien: IDHocVien, IDLopHoc: IDLopHocCu }, { IDLopHoc, TenHocVien,SoDienThoai,Email }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDHocVien, IDLopHoc) {
        return new Promise(async resolve => {
            try {
                let checkID = await HOCVIEN_MODEL.findOne({ IDHocVien: IDHocVien, IDLopHoc: IDLopHoc })
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy học viên để xóa' });
                let deleteHocVien = await HOCVIEN_MODEL.findOneAndDelete({ IDHocVien: IDHocVien, IDLopHoc: IDLopHoc});
                resolve({ error: false, data: deleteHocVien })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static getThongKeDangKiHocVien(BatDau,KetThuc)
    {
        return new Promise(async resolve=>{
            let data = await HOCVIEN_MODEL.aggregate([
                {
                    $match:
                    {
                        $and:[
                            { "ThoiGianDangKi": { "$lte": KetThuc } },             
                            { "ThoiGianDangKi": { "$gte": BatDau } },          // BatDau<= ThoiGianDangKi <= KetThuc
                        ]
                    }
                }
            ]);
            if (!data)
                return resolve({ error: true, message: 'Không thể lấy danh sách học viên' });
            let Tong=data.length;
            let Online=0;
            let TrungTam=0;
            if(Tong>0)
            {
                for (let index = 0; index < Tong; index++) {
                    if(data[index].NguoiThem=='online')
                    {
                        Online++;
                    }
                    else
                    {
                        TrungTam++;
                    }
                }
            }
            return resolve({ error: false, Tong: Tong,Online:Online,TrungTam:TrungTam })
        });
    }
    static getThongKeHinhThucThanhToanHocVien(BatDau,KetThuc)
    {
        return new Promise(async resolve=>{
            let data = await HOCVIEN_MODEL.aggregate([
                {
                    $match:
                    {
                        $and:[
                            { "ThoiGianDangKi": { "$lte": KetThuc } },             
                            { "ThoiGianDangKi": { "$gte": BatDau } },          // BatDau<= ThoiGianDangKi <= KetThuc
                        ]
                    }
                }
            ]);
            if (!data)
                return resolve({ error: true, message: 'Không thể lấy danh sách học viên' });
            let Tong=data.length;
            let Momo=0;
            let TrungTam=0;
            if(Tong>0)
            {
                for (let index = 0; index < Tong; index++) {
                    if(data[index].HinhThucThanhToan=='momo')
                    {
                        Momo++;
                    }
                    else
                    {
                        TrungTam++;
                    }
                }
            }
            return resolve({ error: false, Tong: Tong,Momo:Momo,TrungTam:TrungTam })
        });
    }
    static getThongKeDoanhThuTheoHinhThucThanhToan(BatDau,KetThuc)
    {
        return new Promise(async resolve=>{
            let data = await HOCVIEN_MODEL.aggregate([
                {
                    $match:
                    {
                        $and:[
                            { "ThoiGianDangKi": { "$lte": KetThuc } },             
                            { "ThoiGianDangKi": { "$gte": BatDau } },          // BatDau<= ThoiGianDangKi <= KetThuc
                        ]
                    }
                }
            ]);
            if (!data)
                return resolve({ error: true, message: 'Không thể lấy danh sách học viên' });
            let TongTien=0;
            let Momo=0;
            let TrungTam=0;
            let tienTemp=0;
            if(data.length>0)
            {
                for (let index = 0; index < data.length; index++) {
                    tienTemp=parseInt(data[index].SoTien,10);
                    TongTien+=tienTemp;
                    if(data[index].HinhThucThanhToan=='momo')
                    {
                        Momo+=tienTemp;
                    }
                    else
                    {
                        TrungTam+=tienTemp;
                    }
                }
            }
            return resolve({ error: false, Tong: TongTien,Momo:Momo,TrungTam:TrungTam })
        });
    }
}