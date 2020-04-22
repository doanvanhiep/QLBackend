const LOPHOC_MODEL = require('../database/LopHoc-Coll');

module.exports = class LopHoc extends LOPHOC_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await LOPHOC_MODEL.find();
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({MaLopHoc,IDLopHocPhan,IDGiangVien,IDCaHoc,IDPhongHoc,IDThuTrongTuan,SiSo,ThoiGianBatDau,ThoiGianKetThuc,TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let lastLopHoc=await LOPHOC_MODEL.findOne().sort({IDLopHoc:-1});
                let IDLopHoc=1;
                if(lastLopHoc!=null)
                {
                    IDLopHoc=lastLopHoc.IDLopHoc+1;
                }
                let LopHoc = new LOPHOC_MODEL({IDLopHoc,MaLopHoc,IDLopHocPhan,IDGiangVien,IDCaHoc,IDPhongHoc,IDThuTrongTuan,SiSo,ThoiGianBatDau,ThoiGianKetThuc,TrangThai});
                let saveLopHoc = await LopHoc.save();
                if (!saveLopHoc) return resolve({ error: true, message: 'Không thể thêm lớp học' });
                resolve({ error: false, data: LopHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDLopHoc,MaLopHoc,IDLopHocPhan,IDGiangVien,IDCaHoc,IDPhongHoc,IDThuTrongTuan,SiSo,ThoiGianBatDau,ThoiGianKetThuc,TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await LOPHOC_MODEL.findOne({IDLopHoc:IDLopHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học để sửa' });
                let updateID = await LOPHOC_MODEL.findOneAndUpdate({ IDLopHoc: IDLopHoc }, {MaLopHoc,IDLopHocPhan,IDGiangVien,IDCaHoc,IDPhongHoc,IDThuTrongTuan,SiSo,ThoiGianBatDau,ThoiGianKetThuc,TrangThai}, { new: true });
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
}