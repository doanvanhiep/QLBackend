const THONGTINLOPHOC_MODEL = require('../database/ThongTinLopHoc-Coll');

module.exports = class ThongTinLopHoc extends THONGTINLOPHOC_MODEL {
    static getSchedule(IDGiangVien, BatDau, KetThuc) {
        return new Promise(async resolve => {
            try {
                let dataBegin = await THONGTINLOPHOC_MODEL.aggregate([
                    {
                        $match:
                        {
                            $and: [
                                { IDGiangVien: parseInt(IDGiangVien, 10) },
                                { TrangThai: 1 }
                            ]
                        }
                    }, //tìm kiếm lớp học theo ID lớp học phần
                    {
                        $lookup: {
                            from: 'phonghocs',
                            localField: 'IDPhongHoc',
                            foreignField: 'IDPhongHoc',
                            as: 'TenPhong'
                        }
                    },
                    { $unwind: "$TenPhong" },
                    {
                        $match:
                            { "TenPhong.TrangThai": 1 }
                    },//điều kiện lớp học
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
                        {
                            $and: [
                                { "lh.TrangThai": 1 },
                                { "lh.NgayKhaiGiang": { "$lte": KetThuc } },             //ngày khai giảng <= ngày kết thúc của tuần
                                { "lh.NgayBeGiang": { "$gte": BatDau } },                 // ngày bế giảng >= ngày bắt đầu của tuần
                            ]
                        }
                    },//get tenlophocphan
                    {
                        $lookup: {
                            from: 'lophocphans',
                            localField: 'lh.IDLopHocPhan',
                            foreignField: 'IDLopHocPhan',
                            as: 'TenLopHocPhan'
                        }
                    },
                    { $unwind: "$TenLopHocPhan" },
                    {
                        $match:
                            { "TenLopHocPhan.TrangThai": 1 }
                    },
                    {
                        $project:
                        {
                            CaHoc: 1,
                            Thu: 1,
                            "lh": "$lh",
                            "TenPhong": "$TenPhong.TenPhong",
                            "TenLopHocPhan": "$TenLopHocPhan.TenLopHocPhan"
                        }
                    }
                    ,
                    {
                        "$group": {
                            "_id": "$_id",
                            lh: { "$first": "$lh" },
                            CaHoc: { "$first": "$CaHoc" },
                            Thu: { "$first": "$Thu" },
                            TenPhong: { "$first": "$TenPhong" },
                            TenLopHocPhan: { "$first": "$TenLopHocPhan" }
                        }
                    }
                ]);
                //xử lý thời khóa biểu
                var temp;
                var disDay;
                var daydefault = new Date(BatDau).getDay();
                let data = [];
                var objAdd = {};
                for (var i = 0; i < 5; i++) {
                    objAdd = {};
                    for (var j = 0; j < 6; j++) {
                        temp = new Date(BatDau);
                        disDay = 0;
                        var obj = dataBegin.filter(obj => {
                            return obj.CaHoc === "Ca " + (i + 1) && obj.Thu === "Thứ " + (j + 2);
                        })[0];
                        if (obj === undefined) {
                            objAdd[j] = "";
                        }
                        else {
                            if ((j + 1) >= daydefault) {
                                disDay = j + 1 - daydefault;
                                temp.setDate(temp.getDate() + disDay);
                            }
                            else {
                                disDay = 7 - (daydefault - j - 1);
                                temp.setDate(temp.getDate() + disDay);
                            }
                            if (temp >= new Date(obj.lh.NgayKhaiGiang) && temp <= new Date(obj.lh.NgayBeGiang)) {
                                objAdd[j] = "LỚP: " + obj.TenLopHocPhan + "\nPHÒNG: " + obj.TenPhong;
                            }
                        }
                    }
                    data.push(objAdd);
                }
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy thời khóa biểu' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await THONGTINLOPHOC_MODEL.find({ TrangThai: 1 });
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({ IDLopHoc, CaHoc, Thu, IDPhongHoc, IDGiangVien }) {
        return new Promise(async resolve => {
            try {
                let lastThongTinLopHoc = await THONGTINLOPHOC_MODEL.findOne().sort({ IDThongTinLopHoc: -1 });
                let IDThongTinLopHoc = 1;
                let TrangThai = 1;
                if (lastThongTinLopHoc != null) {
                    IDThongTinLopHoc = lastThongTinLopHoc.IDThongTinLopHoc + 1;
                }
                let ThongTinLopHoc = new THONGTINLOPHOC_MODEL({ IDThongTinLopHoc, IDLopHoc, CaHoc, Thu, IDPhongHoc, IDGiangVien, TrangThai });
                let saveLopHoc = await ThongTinLopHoc.save();
                if (!saveLopHoc) return resolve({ error: true, message: 'Không thể thêm thông tin lớp học' });
                resolve({ error: false, data: ThongTinLopHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({ IDThongTinLopHoc, CaHoc, Thu, IDPhongHoc, IDGiangVien }) {
        return new Promise(async resolve => {
            try {
                let checkID = await THONGTINLOPHOC_MODEL.findOne({ IDThongTinLopHoc: IDThongTinLopHoc });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy thông tin lớp học để sửa' });
                let updateID = await THONGTINLOPHOC_MODEL.findOneAndUpdate({ IDThongTinLopHoc: IDThongTinLopHoc }, { CaHoc, Thu, IDPhongHoc, IDGiangVien }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDLopHoc) {
        return new Promise(async resolve => {
            try {
                let checkID = await THONGTINLOPHOC_MODEL.findOne({ IDLopHoc: IDLopHoc })
                if (checkID == null) return resolve({ error: true, message: 'Không tìm thấy thông tin lớp học để xóa' });
                let deleteLopHoc = await THONGTINLOPHOC_MODEL.deleteMany({ IDLopHoc: IDLopHoc });
                resolve({ error: false, data: deleteLopHoc })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static updatestatus({ IDLopHoc, TrangThai }) {
        return new Promise(async resolve => {
            try {
                let checkID = await THONGTINLOPHOC_MODEL.findOne({ IDLopHoc: IDLopHoc });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy thông tin lớp học để sửa' });
                let updateID = await THONGTINLOPHOC_MODEL.findOneAndUpdate({ IDLopHoc: IDLopHoc }, { TrangThai }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}