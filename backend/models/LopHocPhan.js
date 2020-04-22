const LOPHOCPHAN_MODEL = require('../database/LopHocPhan-Coll');

module.exports = class LopHocPhan extends LOPHOCPHAN_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await LOPHOCPHAN_MODEL.find();
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách lớp học phần' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,TongSoGio,HocPhi,SiSo,MoTa, TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let lastLopHocPhan=await LOPHOCPHAN_MODEL.findOne().sort({IDLopHocPhan:-1});
                let IDLopHocPhan=1;
                if(lastLopHocPhan!=null)
                {
                    IDLopHocPhan=lastLopHocPhan.IDLopHocPhan+1;
                }
                let LopHocPhan = new LOPHOCPHAN_MODEL({IDLopHocPhan,IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,TongSoGio,HocPhi,SiSo,MoTa, TrangThai});
                let saveLopHocPhan = await LopHocPhan.save();
                if (!saveLopHocPhan) return resolve({ error: true, message: 'Không thể thêm lớp học phần' });
                resolve({ error: false, data: LopHocPhan });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDLopHocPhan,IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,TongSoGio,HocPhi,SiSo,MoTa, TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await LOPHOCPHAN_MODEL.findOne({IDLopHocPhan:IDLopHocPhan});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học phần để sửa' });
                let updateID = await LOPHOCPHAN_MODEL.findOneAndUpdate({ IDLopHocPhan: IDLopHocPhan }, {IDKhoaHoc,MaLopHocPhan,TenLopHocPhan,TongSoGio,HocPhi,SiSo,MoTa, TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDLopHocPhan)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await LOPHOCPHAN_MODEL.findOne({IDLopHocPhan:IDLopHocPhan})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học phần để xóa'});
                let deleteLopHocPhan = await LOPHOCPHAN_MODEL.findOneAndDelete({ IDLopHocPhan: IDLopHocPhan });
                resolve({ error: false, data: deleteLopHocPhan })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
}