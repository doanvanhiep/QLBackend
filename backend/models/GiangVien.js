const GIANGVIEN_MODEL = require('../database/GiangVien-Coll');

module.exports = class GiangVien extends GIANGVIEN_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await GIANGVIEN_MODEL.find({TrangThai:1});
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách giảng viên' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({ HoTen, DiaChi, SoDienThoai, Email,MoTa,HinhAnh,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let lastGV=await GIANGVIEN_MODEL.findOne().sort({IDGiangVien:-1});
                let IDGiangVien=1;
                if(lastGV!=null)
                {
                    IDGiangVien=lastGV.IDGiangVien+1;
                }
                let TrangThai=1
                let GiangVien = new GIANGVIEN_MODEL({ IDGiangVien, HoTen, DiaChi, SoDienThoai, Email,MoTa,HinhAnh,GhiChu,TrangThai});
                let saveGiangVien = await GiangVien.save();
                if (!saveGiangVien) return resolve({ error: true, message: 'Không thể thêm giảng viên' });
                resolve({ error: false, data: GiangVien });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDGiangVien, HoTen, DiaChi, SoDienThoai, Email,MoTa,HinhAnh,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await GIANGVIEN_MODEL.findOne({IDGiangVien:IDGiangVien});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy giảng viên để sửa' });
                let updateID = await GIANGVIEN_MODEL.findOneAndUpdate({ IDGiangVien: IDGiangVien }, {HoTen, DiaChi, SoDienThoai, Email,MoTa,HinhAnh,GhiChu}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDGiangVien)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await GIANGVIEN_MODEL.findOne({IDGiangVien:IDGiangVien})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy giảng viên để xóa'});
                let deleteGiangVien = await GIANGVIEN_MODEL.findOneAndDelete({ IDGiangVien: IDGiangVien });
                resolve({ error: false, data: deleteGiangVien })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static UpdateState(IDGiangVien,TrangThai)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await GIANGVIEN_MODEL.findOne({IDGiangVien:IDGiangVien});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy giảng viên' });
                let updateID = await GIANGVIEN_MODEL.findOneAndUpdate({ IDGiangVien: IDGiangVien }, {TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}