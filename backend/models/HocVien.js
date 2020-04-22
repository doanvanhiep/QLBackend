const HOCVIEN_MODEL = require('../database/HocVien-Coll');

module.exports = class HocVien extends HOCVIEN_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await HOCVIEN_MODEL.find();
                console.log(data);
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách học viên' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({TenHocVien, Email, SoDienThoai, ThoiGianDangKi})
    {
        return new Promise(async resolve => {
            try {
                let lastHV=await HOCVIEN_MODEL.findOne().sort({IDHocVien:-1});
                let IDHocVien=1;
                if(lastHV!=null)
                {
                    IDHocVien=lastHV.IDHocVien+1;
                }
                let HocVien = new HOCVIEN_MODEL({IDHocVien,TenHocVien, Email, SoDienThoai, ThoiGianDangKi});
                let saveHocVien = await HocVien.save();
                if (!saveHocVien) return resolve({ error: true, message: 'Không thể thêm học viên' });
                resolve({ error: false, data: HocVien });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDHocVien,TenHocVien, DiaChi,Email, SoDienThoai,ThoiGianDangKi})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await HOCVIEN_MODEL.findOne({IDHocVien:IDHocVien});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy học viên để sửa' });
                let updateID = await HOCVIEN_MODEL.findOneAndUpdate({ IDHocVien: IDHocVien }, {TenHocVien, DiaChi,Email, SoDienThoai,ThoiGianDangKi}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDHocVien)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await HOCVIEN_MODEL.findOne({IDHocVien:IDHocVien})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy học viên để xóa'});
                let deleteHocVien = await HOCVIEN_MODEL.findOneAndDelete({ IDHocVien: IDHocVien });
                resolve({ error: false, data: deleteHocVien })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
}