const LOPHOC_MODEL = require('../database/LopHoc-Coll');

module.exports = class LopHoc extends LOPHOC_MODEL {
    static getInfoLopHoc(IDLopHocPhan,IDLopHoc) {
        return new Promise(async resolve => {
            try {
                let data = await LOPHOC_MODEL.aggregate([
                    {
                        $match:
                        {
                            $and:[
                                {TrangThai:1},
                                {IDLopHocPhan:parseInt(IDLopHocPhan, 10)},
                                {IDLopHoc:parseInt(IDLopHoc, 10)},
                            ]
                        }
                    },
                    {
                        $lookup:{
                            from:'lophocphans',
                            localField:'IDLopHocPhan',
                            foreignField:'IDLopHocPhan',
                            as:'LopHocPhan'
                        }
                    },
                    {   $unwind:"$LopHocPhan" }
                ]);
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách lớp học phần' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getListCaBuoiHocByIDLopHocPhan(IDLopHocPhan) {
        return new Promise(async resolve => {
            try {
                let data = await LOPHOC_MODEL.aggregate([
                    {
                        $match:
                        {
                            $and:[
                                {IDLopHocPhan:parseInt(IDLopHocPhan, 10)},
                                {TrangThai:1}
                            ]
                        }
                    },
                    {
                        $lookup:{
                            from:'thongtinlophocs',
                            localField:'IDLopHoc',
                            foreignField:'IDLopHoc',
                            as:'ThongTinLopHoc'
                        }
                    },
                    {   $unwind:"$ThongTinLopHoc" },
                    {
                        $match:
                        {"ThongTinLopHoc.TrangThai":1}
                    },
                    { "$group": {
                        "_id": "$_id",
                        "IDLopHoc": { "$first": "$IDLopHoc" },
                        "ThongTinLopHoc": { "$push": "$ThongTinLopHoc" },
                    }}
                ]);
                let res="";
                data.forEach(dt => {
                    res="";
                    dt.ThongTinLopHoc.forEach(element => {
                        res+=element.Thu+"("+element.CaHoc+") ";
                    });
                    dt.ThongTinLopHoc=res;
                });
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await LOPHOC_MODEL.find({TrangThai:1});
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({IDLopHocPhan,MaLopHoc,NgayKhaiGiang,NgayBeGiang,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let lastLopHoc=await LOPHOC_MODEL.findOne().sort({IDLopHoc:-1});
                let IDLopHoc=1;
                let TrangThai=1;
                if(lastLopHoc!=null)
                {
                    IDLopHoc=lastLopHoc.IDLopHoc+1;
                }
                let LopHoc = new LOPHOC_MODEL({IDLopHoc,IDLopHocPhan,MaLopHoc,NgayKhaiGiang,NgayBeGiang,GhiChu,TrangThai});
                let saveLopHoc = await LopHoc.save();
                if (!saveLopHoc) return resolve({ error: true, message: 'Không thể thêm lớp học' });
                resolve({ error: false, data: LopHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDLopHoc,NgayBeGiang,NgayKhaiGiang})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await LOPHOC_MODEL.findOne({IDLopHoc:IDLopHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học để sửa' });
                let updateID = await LOPHOC_MODEL.findOneAndUpdate({ IDLopHoc: IDLopHoc }, {NgayBeGiang,NgayKhaiGiang}, { new: true });
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
                let checkID = await LOPHOC_MODEL.findOne({IDLopHoc:IDLopHoc})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học để xóa'});
                let deleteLopHoc = await LOPHOC_MODEL.findOneAndDelete({ IDLopHoc: IDLopHoc });
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
                let checkID = await LOPHOC_MODEL.findOne({IDLopHoc:IDLopHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học để sửa' });
                let updateID = await LOPHOC_MODEL.findOneAndUpdate({ IDLopHoc: IDLopHoc }, {TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}