const THUTRONGTUAN_MODEL = require('../database/ThuTrongTuan-Coll');

module.exports = class ThuTrongTuan extends THUTRONGTUAN_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await THUTRONGTUAN_MODEL.find();
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách thứ trong tuần' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({ThuTrongTuan,SoNgay,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let lastThuTrongTuan=await THUTRONGTUAN_MODEL.findOne().sort({IDThuTrongTuan:-1});
                let IDThuTrongTuan=1;
                if(lastThuTrongTuan!=null)
                {
                    IDThuTrongTuan=lastThuTrongTuan.IDThuTrongTuan+1;
                }
                let thuTrongTuan = new THUTRONGTUAN_MODEL({IDThuTrongTuan,ThuTrongTuan,SoNgay,GhiChu});
                let saveThuTrongTuan = await thuTrongTuan.save();
                if (!saveThuTrongTuan) return resolve({ error: true, message: 'Không thể thêm thứ trong tuần' });
                resolve({ error: false, data: thuTrongTuan });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDThuTrongTuan,ThuTrongTuan,SoNgay,GhiChu})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await THUTRONGTUAN_MODEL.findOne({IDThuTrongTuan:IDThuTrongTuan});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy thứ trong tuần để sửa' });
                let updateID = await THUTRONGTUAN_MODEL.findOneAndUpdate({ IDThuTrongTuan: IDThuTrongTuan }, {ThuTrongTuan,SoNgay,GhiChu}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDThuTrongTuan)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await THUTRONGTUAN_MODEL.findOne({IDThuTrongTuan:IDThuTrongTuan})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy thứ trong tuần để xóa'});
                let deleteThuTrongTuan = await THUTRONGTUAN_MODEL.findOneAndDelete({ IDThuTrongTuan: IDThuTrongTuan });
                resolve({ error: false, data: deleteThuTrongTuan })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
}