const LOPHOC_MODEL = require('../database/LopHoc-Coll');
const HOCVIEN_MODEL = require('../database/HocVien-Coll');
const THONGTINLOPHOC_MODEL = require('../database/ThongTinLopHoc-Coll');
module.exports = class LopHoc extends LOPHOC_MODEL {
  static checkPhongHocVaGiangVien(BatDau, KetThuc, IDPhongHoc, IDGiangVien, CaHoc, Thu) {
    return new Promise(async resolve => {
      try {
        let statusPH = false;
        let dataPH = await LOPHOC_MODEL.aggregate([
          {
            $match:
            {
              $and: [
                { TrangThai: 1 },
                { NgayKhaiGiang: { "$lte": KetThuc } },             //ngày khai giảng <= ngày kết thúc của tuần
                { NgayBeGiang: { "$gte": BatDau } },                 // ngày bế giảng >= ngày bắt đầu của tuần
              ]
            }
          }, //tìm kiếm lớp học theo ID lớp học phần
          {
            $lookup: {
              from: 'thongtinlophocs',
              localField: 'IDLopHoc',
              foreignField: 'IDLopHoc',
              as: 'ttlh'
            }
          },
          { $unwind: "$ttlh" },
          {
            $match:
            {
              $and: [
                { "ttlh.TrangThai": 1 },
                { "ttlh.IDPhongHoc": parseInt(IDPhongHoc, 10) },
                { "ttlh.CaHoc": CaHoc },
                { "ttlh.Thu": Thu }
              ]
            }
          },
          {
            $project:
            {
              MaLopHoc: 1,
              "ttlh": "$ttlh"
            }
          }
        ]);

        if (!dataPH)
          return resolve({ error: true, message: 'Không thể kiểm tra ca học. Vui lòng xem lại' });
        else {
          if (dataPH.length > 0) {
            statusPH = true;
          }
          else {
            statusPH = false;
          }
        }

        //check GiangVien
        let statusGV = false;
        let dataGV = await LOPHOC_MODEL.aggregate([
          {
            $match:
            {
              $and: [
                { TrangThai: 1 },
                { NgayKhaiGiang: { "$lte": KetThuc } },             //ngày khai giảng <= ngày kết thúc của tuần
                { NgayBeGiang: { "$gte": BatDau } },                 // ngày bế giảng >= ngày bắt đầu của tuần
              ]
            }
          }, //tìm kiếm lớp học theo ID lớp học phần
          {
            $lookup: {
              from: 'thongtinlophocs',
              localField: 'IDLopHoc',
              foreignField: 'IDLopHoc',
              as: 'ttlh'
            }
          },
          { $unwind: "$ttlh" },
          {
            $match:
            {
              $and: [
                { "ttlh.TrangThai": 1 },
                { "ttlh.IDGiangVien": parseInt(IDGiangVien, 10) },
                { "ttlh.CaHoc": CaHoc },
                { "ttlh.Thu": Thu }
              ]
            }
          },
          {
            $project:
            {
              MaLopHoc: 1,
              "ttlh": "$ttlh"
            }
          }
        ]);

        if (!dataGV)
          return resolve({ error: true, message: 'Không thể kiểm tra giảng viên. Vui lòng xem lại' });
        else {
          if (dataGV.length > 0) {
            statusGV = true;
          }
          else {
            statusGV = false;
          }
        }
        return resolve({ error: false, statusPH: statusPH, statusGV: statusGV });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }

  static getListLopHoc() {
    return new Promise(async resolve => {
      try {
        let data = await LOPHOC_MODEL.aggregate([
          {
            $match:
            {
              TrangThai: 1
            }
          }, //tìm kiếm lớp học phần
          {
            $lookup: {
              from: 'lophocphans',
              localField: 'IDLopHocPhan',
              foreignField: 'IDLopHocPhan',
              as: 'LHP'
            }
          },
          { $unwind: "$LHP" },
          {
            $match:
              { "LHP.TrangThai": 1 }
          }, //tìm kiếm học viên
          {
            $lookup: {
              from: 'hocviens',
              localField: 'IDLopHoc',
              foreignField: 'IDLopHoc',
              as: 'HV'
            }
          },//tìm kiếm thông tin lớp học
          {
            $lookup: {
              from: 'thongtinlophocs',
              localField: 'IDLopHoc',
              foreignField: 'IDLopHoc',
              as: 'TTLH'
            }
          },
          { $unwind: "$TTLH" },
          {
            $match: { "TTLH.TrangThai": 1 }
          }, //tìm kiếm thông tin giảng viên mỗi lớp học 
          {
            $lookup: {
              from: 'giangviens',
              localField: 'TTLH.IDGiangVien',
              foreignField: 'IDGiangVien',
              as: 'TTLH.TenGiangVien'
            }
          },
          { $unwind: "$TTLH.TenGiangVien" },
          {
            $match:
              { "TTLH.TenGiangVien.TrangThai": 1 }
          }, //Tìm kiếm thông tin phòng học mỗi lớp học
          {
            $lookup: {
              from: 'phonghocs',
              localField: 'TTLH.IDPhongHoc',
              foreignField: 'IDPhongHoc',
              as: 'TTLH.TenPhongHoc'
            }
          },
          { $unwind: "$TTLH.TenPhongHoc" },
          {
            $match:
              { "TTLH.TenPhongHoc.TrangThai": 1 }
          },
          {
            $project:
            {
              IDLopHocPhan: 1,
              IDLopHoc: 1,
              MaLopHoc: 1,
              NgayKhaiGiang: 1,
              NgayBeGiang: 1,
              GhiChu: 1,
              TrangThai: 1,
              ThongTinLopHoc: 1,
              "TTLH.IDThongTinLopHoc": "$TTLH.IDThongTinLopHoc",
              "TTLH.CaHoc": "$TTLH.CaHoc",
              "TTLH.Thu": "$TTLH.Thu",
              "TTLH.IDPhongHoc": "$TTLH.IDPhongHoc",
              "TTLH.IDGiangVien": "$TTLH.IDGiangVien",
              "TTLH.TenGiangVien": "$TTLH.TenGiangVien.HoTen",
              "TTLH.TenPhongHoc": "$TTLH.TenPhongHoc.TenPhong",
              "LHP": "$LHP",
              "HV": "$HV"
            }
          },
          {
            "$group": {
              "_id": "$_id",
              IDLopHocPhan: { "$first": "$IDLopHocPhan" },
              IDLopHoc: { "$first": "$IDLopHoc" },
              MaLopHoc: { "$first": "$MaLopHoc" },
              NgayKhaiGiang: { "$first": "$NgayKhaiGiang" },
              NgayBeGiang: { "$first": "$NgayBeGiang" },
              GhiChu: { "$first": "$GhiChu" },
              TrangThai: { "$first": "$TrangThai" },
              ThongTinLopHoc: { "$first": "" },
              "TTLH": { "$push": "$TTLH" },
              "LHP": { "$first": "$LHP" },
              "HV": { "$first": "$HV" },
            }
          }
        ]);
        let res = "";
        data.forEach(dt => {
          res = "";
          dt.TTLH.forEach(element => {
            res += element.Thu + "-" + element.CaHoc + "-" + element.TenPhongHoc + "-" + element.TenGiangVien;
            res += "\n";
          });
          dt.ThongTinLopHoc = res;
        });
        if (!data)
          return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
        return resolve({ error: false, data: data })
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getListLopHocByIDGiangVien(IDGiangVien) {
    return new Promise(async resolve => {
      try {
        let data = await LOPHOC_MODEL.aggregate([
          {
            $match:
            {
              TrangThai: 1
            }
          }, //tìm kiếm lớp học phần
          {
            $lookup: {
              from: 'lophocphans',
              localField: 'IDLopHocPhan',
              foreignField: 'IDLopHocPhan',
              as: 'LHP'
            }
          },
          { $unwind: "$LHP" },
          {
            $match:
              { "LHP.TrangThai": 1 }
          }, //tìm kiếm học viên
          {
            $lookup: {
              from: 'hocviens',
              localField: 'IDLopHoc',
              foreignField: 'IDLopHoc',
              as: 'HV'
            }
          },//tìm kiếm thông tin lớp học
          {
            $lookup: {
              from: 'thongtinlophocs',
              localField: 'IDLopHoc',
              foreignField: 'IDLopHoc',
              as: 'TTLH'
            }
          },
          { $unwind: "$TTLH" },
          {
            $match:
            {
              $and: [
                { "TTLH.TrangThai": 1 },
                { "TTLH.IDGiangVien": parseInt(IDGiangVien, 10) }
              ]
            }
          }, //tìm kiếm thông tin giảng viên mỗi lớp học 
          {
            $lookup: {
              from: 'giangviens',
              localField: 'TTLH.IDGiangVien',
              foreignField: 'IDGiangVien',
              as: 'TTLH.TenGiangVien'
            }
          },
          { $unwind: "$TTLH.TenGiangVien" },
          {
            $match:
              { "TTLH.TenGiangVien.TrangThai": 1 }
          }, //Tìm kiếm thông tin phòng học mỗi lớp học
          {
            $lookup: {
              from: 'phonghocs',
              localField: 'TTLH.IDPhongHoc',
              foreignField: 'IDPhongHoc',
              as: 'TTLH.TenPhongHoc'
            }
          },
          { $unwind: "$TTLH.TenPhongHoc" },
          {
            $match:
              { "TTLH.TenPhongHoc.TrangThai": 1 }
          },
          {
            $project:
            {
              IDLopHocPhan: 1,
              IDLopHoc: 1,
              MaLopHoc: 1,
              NgayKhaiGiang: 1,
              NgayBeGiang: 1,
              GhiChu: 1,
              TrangThai: 1,
              ThongTinLopHoc: 1,
              "TTLH.IDThongTinLopHoc": "$TTLH.IDThongTinLopHoc",
              "TTLH.CaHoc": "$TTLH.CaHoc",
              "TTLH.Thu": "$TTLH.Thu",
              "TTLH.IDPhongHoc": "$TTLH.IDPhongHoc",
              "TTLH.IDGiangVien": "$TTLH.IDGiangVien",
              "TTLH.TenGiangVien": "$TTLH.TenGiangVien.HoTen",
              "TTLH.TenPhongHoc": "$TTLH.TenPhongHoc.TenPhong",
              "LHP": "$LHP",
              "HV": "$HV"
            }
          },
          {
            "$group": {
              "_id": "$_id",
              IDLopHocPhan: { "$first": "$IDLopHocPhan" },
              IDLopHoc: { "$first": "$IDLopHoc" },
              MaLopHoc: { "$first": "$MaLopHoc" },
              NgayKhaiGiang: { "$first": "$NgayKhaiGiang" },
              NgayBeGiang: { "$first": "$NgayBeGiang" },
              GhiChu: { "$first": "$GhiChu" },
              TrangThai: { "$first": "$TrangThai" },
              ThongTinLopHoc: { "$first": "" },
              "TTLH": { "$push": "$TTLH" },
              "LHP": { "$first": "$LHP" },
              "HV": { "$first": "$HV" },
            }
          }
        ]);
        let res = "";
        data.forEach(dt => {
          res = "";
          dt.TTLH.forEach(element => {
            res += element.Thu + "-" + element.CaHoc + "-" + element.TenPhongHoc + "-" + element.TenGiangVien;
            res += "\n";
          });
          dt.ThongTinLopHoc = res;
        });
        if (!data)
          return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
        return resolve({ error: false, data: data })
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getListLopHocByIDLopHocPhan(IDLopHocPhan) {
    return new Promise(async resolve => {
      try {
        let data = await LOPHOC_MODEL.aggregate([
          {
            $match:
            { IDLopHocPhan: parseInt(IDLopHocPhan, 10) }
          }, //tìm kiếm lớp học theo ID lớp học phần
          {
            $lookup: {
              from: 'thongtinlophocs',
              localField: 'IDLopHoc',
              foreignField: 'IDLopHoc',
              as: 'TTLH'
            }
          },
          { $unwind: "$TTLH" },
          /* {
            $match:
              { "TTLH.TrangThai": 0 }
          }, */ //tìm kiếm thông tin giảng viên mỗi lớp học 
          {
            $lookup: {
              from: 'giangviens',
              localField: 'TTLH.IDGiangVien',
              foreignField: 'IDGiangVien',
              as: 'TTLH.TenGiangVien'
            }
          },
          { $unwind: "$TTLH.TenGiangVien" },
          {
            $match:
              { "TTLH.TenGiangVien.TrangThai": 1 }
          }, //Tìm kiếm thông tin phòng học mỗi lớp học
          {
            $lookup: {
              from: 'phonghocs',
              localField: 'TTLH.IDPhongHoc',
              foreignField: 'IDPhongHoc',
              as: 'TTLH.TenPhongHoc'
            }
          },
          { $unwind: "$TTLH.TenPhongHoc" },
          {
            $match:
              { "TTLH.TenPhongHoc.TrangThai": 1 }
          }
          ,
          {
            $project:
            {
              IDLopHoc: 1,
              MaLopHoc: 1,
              NgayKhaiGiang: 1,
              NgayBeGiang: 1,
              GhiChu: 1,
              TrangThai: 1,
              ThongTinLopHoc: 1,
              "TTLH.IDThongTinLopHoc": "$TTLH.IDThongTinLopHoc",
              "TTLH.CaHoc": "$TTLH.CaHoc",
              "TTLH.Thu": "$TTLH.Thu",
              "TTLH.IDPhongHoc": "$TTLH.IDPhongHoc",
              "TTLH.IDGiangVien": "$TTLH.IDGiangVien",
              "TTLH.TenGiangVien": "$TTLH.TenGiangVien.HoTen",
              "TTLH.TenPhongHoc": "$TTLH.TenPhongHoc.TenPhong"
            }
          }
          ,
          {
            "$group": {
              "_id": "$_id",
              IDLopHoc: { "$first": "$IDLopHoc" },
              MaLopHoc: { "$first": "$MaLopHoc" },
              NgayKhaiGiang: { "$first": "$NgayKhaiGiang" },
              NgayBeGiang: { "$first": "$NgayBeGiang" },
              GhiChu: { "$first": "$GhiChu" },
              TrangThai: { "$first": "$TrangThai" },
              ThongTinLopHoc: { "$first": "" },
              "TTLH": { "$push": "$TTLH" },
            }
          }
        ]);
        let res = "";
        data.forEach(dt => {
          res = "";
          dt.TTLH.forEach(element => {
            res += element.Thu + "-" + element.CaHoc + "-" + element.TenPhongHoc + "-" + element.TenGiangVien;
            // if(element.IDThongTinLopHoc!=dt.TTLH[dt.TTLH.length-1].IDThongTinLopHoc)
            res += "\n";
          });
          dt.ThongTinLopHoc = res;
        });
        if (!data)
          return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
        return resolve({ error: false, data: data })
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getNgayKhaiGiangLopHoc(IDLopHoc) {
    return new Promise(async resolve => {
      try {
        let data = await LOPHOC_MODEL.findOne({ IDLopHoc: IDLopHoc, TrangThai: 1 }).select({ "_id": 0, "NgayKhaiGiang": 1, "NgayBeGiang": 1 });
        if (!data)
          return resolve({ error: true, message: 'Không thể lấy danh sách lớp học phần' });
        return resolve({ error: false, data: data })
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getInfoLopHoc(IDLopHocPhan, IDLopHoc) {
    return new Promise(async resolve => {
      try {
        let data = await LOPHOC_MODEL.aggregate([
          {
            $match:
            {
              $and: [
                { TrangThai: 1 },
                { IDLopHocPhan: parseInt(IDLopHocPhan, 10) },
                { IDLopHoc: parseInt(IDLopHoc, 10) },
              ]
            }
          },
          {
            $lookup: {
              from: 'lophocphans',
              localField: 'IDLopHocPhan',
              foreignField: 'IDLopHocPhan',
              as: 'LopHocPhan'
            }
          },
          { $unwind: "$LopHocPhan" }
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
              $and: [
                { IDLopHocPhan: parseInt(IDLopHocPhan, 10) },
                { TrangThai: 1 }
              ]
            }
          },
          {
            $lookup: {
              from: 'thongtinlophocs',
              localField: 'IDLopHoc',
              foreignField: 'IDLopHoc',
              as: 'ThongTinLopHoc'
            }
          },
          { $unwind: "$ThongTinLopHoc" },
          {
            $match:
              { "ThongTinLopHoc.TrangThai": 1 }
          },
          {
            "$group": {
              "_id": "$_id",
              "IDLopHoc": { "$first": "$IDLopHoc" },
              "ThongTinLopHoc": { "$push": "$ThongTinLopHoc" },
            }
          }
        ]);
        let res = "";
        data.forEach(dt => {
          res = "";
          dt.ThongTinLopHoc.forEach(element => {
            res += element.Thu + "(" + element.CaHoc + ") ";
          });
          dt.ThongTinLopHoc = res;
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
        let data = await LOPHOC_MODEL.find({ TrangThai: 1 });
        if (!data)
          return resolve({ error: true, message: 'Không thể lấy danh sách lớp học' });
        return resolve({ error: false, data: data })
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static add(IDLopHocPhan, MaLopHoc, NgayKhaiGiang, NgayBeGiang, GhiChu) {
    return new Promise(async resolve => {
      try {
        let lastLopHoc = await LOPHOC_MODEL.findOne().sort({ IDLopHoc: -1 });
        let IDLopHoc = 1;
        let TrangThai = 1;
        if (lastLopHoc != null) {
          IDLopHoc = lastLopHoc.IDLopHoc + 1;
        }
        let LopHoc = new LOPHOC_MODEL({ IDLopHoc, IDLopHocPhan, MaLopHoc, NgayKhaiGiang, NgayBeGiang, GhiChu, TrangThai });
        let saveLopHoc = await LopHoc.save();
        if (!saveLopHoc) return resolve({ error: true, message: 'Không thể thêm lớp học' });
        resolve({ error: false, data: LopHoc });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static update(IDLopHoc, MaLopHoc, NgayKhaiGiang, NgayBeGiang, GhiChu) {
    return new Promise(async resolve => {
      try {
        let checkID = await LOPHOC_MODEL.findOne({ IDLopHoc: IDLopHoc });
        if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học để sửa' });
        let updateID = await LOPHOC_MODEL.findOneAndUpdate({ IDLopHoc: IDLopHoc }, { MaLopHoc, NgayKhaiGiang, NgayBeGiang, GhiChu }, { new: true });
        resolve({ error: false, data: updateID });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static delete(IDLopHoc) {
    return new Promise(async resolve => {
      try {
        let checkID = await LOPHOC_MODEL.findOne({ IDLopHoc: IDLopHoc })
        if (checkID == null) return resolve({ error: true, message: 'Không tìm thấy lớp học để xóa' });
        let deleteLopHoc = await LOPHOC_MODEL.findOneAndDelete({ IDLopHoc: IDLopHoc });
        await HOCVIEN_MODEL.deleteMany({ IDLopHoc: IDLopHoc });
        await THONGTINLOPHOC_MODEL.deleteMany({ IDLopHoc: IDLopHoc });
        resolve({ error: false, data: deleteLopHoc })
      } catch (error) {
        return resolve({ error: true, message: error.message })
      }
    });
  }
  static updatestatus( IDLopHoc, TrangThai ) {
    return new Promise(async resolve => {
      try {
        let checkID = await LOPHOC_MODEL.findOne({ IDLopHoc: IDLopHoc });
        if (!checkID) return resolve({ error: true, message: 'Không tìm thấy lớp học để sửa' });
        let updateID = await LOPHOC_MODEL.findOneAndUpdate({ IDLopHoc: IDLopHoc }, { TrangThai }, { new: true });
        await THONGTINLOPHOC_MODEL.updateMany({ IDLopHoc: IDLopHoc }, { TrangThai }, { new: true });
        if(TrangThai==0)
        {
          await HOCVIEN_MODEL.updateMany({ IDLopHoc: IDLopHoc }, { TrangThai }, { new: true });
        }
        resolve({ error: false, data: updateID });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
}