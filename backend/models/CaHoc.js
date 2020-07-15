const CAHOC_MODEL = require('../database/CaHoc-Coll');

module.exports = class CaHoc extends CAHOC_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await CAHOC_MODEL.find();
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách ca học' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({TenCa,GioBatDau,GioKetThuc,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let lastCaHoc=await CAHOC_MODEL.findOne().sort({IDCaHoc:-1});
                let IDCaHoc=1;
                if(lastCaHoc!=null)
                {
                    IDCaHoc=lastCaHoc.IDCaHoc+1;
                }
                
                let CaHoc = new CAHOC_MODEL({IDCaHoc,TenCa,GioBatDau,GioKetThuc,GhiChu});
                let saveCaHoc = await CaHoc.save();
                if (!saveCaHoc) return resolve({ error: true, message: 'Không thể thêm ca học' });
                resolve({ error: false, data: CaHoc });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDCaHoc,TenCa,GioBatDau,GioKetThuc,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await CAHOC_MODEL.findOne({IDCaHoc:IDCaHoc});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy ca học để sửa' });
                let updateID = await CAHOC_MODEL.findOneAndUpdate({ IDCaHoc: IDCaHoc }, {TenCa,GioBatDau,GioKetThuc,GhiChu}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDCaHoc)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await CAHOC_MODEL.findOne({IDCaHoc:IDCaHoc})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy ca học để xóa'});
                let deleteCaHoc = await CAHOC_MODEL.findOneAndDelete({ IDCaHoc: IDCaHoc });
                resolve({ error: false, data: deleteCaHoc })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }  
        });
    }
}