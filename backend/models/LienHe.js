const LIENHE_MODEL = require('../database/LienHe-Coll');

module.exports = class LienHe extends LIENHE_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await LIENHE_MODEL.find({TrangThai:1});
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách liên hệ' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({HoTen,Email,SoDienThoai,NoiDung})
    {
        return new Promise(async resolve => {
            try {
                let lastLienHe=await LIENHE_MODEL.findOne().sort({IDLienHe:-1});
                let IDLienHe=1;
                if(lastLienHe!=null)
                {
                    IDLienHe=lastLienHe.IDLienHe+1;
                }
                let TrangThai=1;
                let LienHe = new LIENHE_MODEL({IDLienHe,HoTen,Email,SoDienThoai,NoiDung,TrangThai});
                let saveLienHe = await LienHe.save();
                if (!saveLienHe) return resolve({ error: true, message: 'Không thể thêm liên hệ' });
                resolve({ error: false, data: LienHe });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDLienHe,HoTen,Email,SoDienThoai,NoiDung,TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await LIENHE_MODEL.findOne({IDLienHe:IDLienHe});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy liên hệ để sửa' });
                let updateID = await LIENHE_MODEL.findOneAndUpdate({ IDLienHe: IDLienHe }, {HoTen,Email,SoDienThoai,NoiDung,TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDLienHe)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await LIENHE_MODEL.findOne({IDLienHe:IDLienHe})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy liên hệ để xóa'});
                let deleteLienHe = await LIENHE_MODEL.findOneAndDelete({ IDLienHe: IDLienHe });
                resolve({ error: false, data: deleteLienHe })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }  
        });
    }
    static updateStatus({IDLienHe,TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await LIENHE_MODEL.findOne({IDLienHe:IDLienHe});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy liên hệ để sửa' });
                let updateID = await LIENHE_MODEL.findOneAndUpdate({ IDLienHe: IDLienHe }, {TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}