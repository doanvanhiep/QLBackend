const QUANTRI_MODEL = require('../database/QuanTri-Coll');

module.exports = class QuanTri extends QUANTRI_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await QUANTRI_MODEL.find();
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách quản trị' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({HoTen,SoDienThoai,Email,DiaChi})
    {
        return new Promise(async resolve => {
            try {
                let lastQuanTri=await QUANTRI_MODEL.findOne().sort({IDQuanTri:-1});
                let IDQuanTri=1;
                if(lastQuanTri!=null)
                {
                    IDQuanTri=lastQuanTri.IDQuanTri+1;
                }
                
                let QuanTri = new QUANTRI_MODEL({IDQuanTri,HoTen,SoDienThoai,Email,DiaChi});
                let saveQuanTri = await QuanTri.save();
                if (!saveQuanTri) return resolve({ error: true, message: 'Không thể thêm quantri' });
                resolve({ error: false, data: QuanTri });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDQuanTri,HoTen,SoDienThoai,Email,DiaChi})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await QUANTRI_MODEL.findOne({IDQuanTri:IDQuanTri});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy quản trị để sửa' });
                let updateID = await QUANTRI_MODEL.findOneAndUpdate({ IDQuanTri: IDQuanTri }, {HoTen,SoDienThoai,Email,DiaChi}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDQuanTri)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await QUANTRI_MODEL.findOne({IDQuanTri:IDQuanTri})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy quản trị để xóa'});
                let deleteQuanTri = await QUANTRI_MODEL.findOneAndDelete({ IDQuanTri: IDQuanTri });
                resolve({ error: false, data: deleteQuanTri })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }  
        });
    }
}