const QUANTRI_MODEL = require('../database/QuanTri-Coll');
const TAIKHOAN_MODEL = require('../models/TaiKhoan');
const ServiceMail = require('../Service/Mail/mail');
const TAIKHOAN_MODELBD = require('../database/TaiKhoan-Coll');
//send Mail
var multer = require('multer');
const uploadfile = multer();
var nodemailer = require('nodemailer');
module.exports = class QuanTri extends QUANTRI_MODEL {
  static getList() {
    return new Promise(async resolve => {
      try {
        let data = await QUANTRI_MODEL.find({ TrangThai: 1 });
        if (!data)
          return resolve({ error: true, message: 'Không thể lấy danh sách quản trị' });
        return resolve({ error: false, data: data })
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static getThongTinByTenTaiKhoan(TenTaiKhoan) {
    return new Promise(async resolve => {
      try {
        let data = await QUANTRI_MODEL.find({ TrangThai: 1,TenTaiKhoan:TenTaiKhoan });
        if (!data)
          return resolve({ error: true, message: 'Không thể lấy danh sách quản trị' });
        return resolve({ error: false, data: data })
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static add({ HoTen, DiaChi, SoDienThoai, Email, HinhAnh, GhiChu }) {
    return new Promise(async resolve => {
      try {
        let lastQuanTri = await QUANTRI_MODEL.findOne().sort({ IDQuanTri: -1 });
        let IDQuanTri = 1;
        if (lastQuanTri != null) {
          IDQuanTri = lastQuanTri.IDQuanTri + 1;
        }
        let TrangThai = 1;
        let TenTaiKhoan = "QTV" + IDQuanTri;
        let QuanTri = new QUANTRI_MODEL({ IDQuanTri, TenTaiKhoan, HoTen, DiaChi, SoDienThoai, Email, HinhAnh, GhiChu, TrangThai });
        let saveQuanTri = await QuanTri.save();
        if (!saveQuanTri) return resolve({ error: true, message: 'Không thể thêm quản trị viên' });
        //Tạo tài khoản đồng thời sendmail cho quản trị viên
        let MatKhau = TenTaiKhoan + SoDienThoai;
        let Quyen = 1;
        TAIKHOAN_MODEL.add({ TenTaiKhoan, MatKhau, Quyen });
        let attachments = [];
        let maillist = [Email];
        //sendmail
        let content = "<h1>Tài khoản đăng nhập vào hệ thống quản lý trung tâm anh ngữ</h1> <h2>Tên tài khoản: " + TenTaiKhoan + "<h2> <h2>Mật khẩu: " + MatKhau + "<h2>";
        var Mail = new ServiceMail(nodemailer)
        Mail.SendMail("Tài khoản đăng nhập", content, attachments, maillist);
        return resolve({ error: false, data: QuanTri });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static update({ IDQuanTri, HoTen, DiaChi, SoDienThoai, Email, HinhAnh, GhiChu }) {
    return new Promise(async resolve => {
      try {
        let checkID = await QUANTRI_MODEL.findOne({ IDQuanTri:IDQuanTri });
        if (!checkID) return resolve({ error: true, message: 'Không tìm thấy quản trị để sửa' });
        let updateID = await QUANTRI_MODEL.findOneAndUpdate({ IDQuanTri: IDQuanTri }, { HoTen, DiaChi, SoDienThoai, Email, HinhAnh, GhiChu }, { new: true });
        return resolve({ error: false, data: updateID });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static updateThongTinCaNhan({ TenTaiKhoan,HoTen, DiaChi, SoDienThoai, Email, HinhAnh }) {
    return new Promise(async resolve => {
      try {
        let checkID = await QUANTRI_MODEL.findOne({ TenTaiKhoan:TenTaiKhoan });
        if (!checkID) return resolve({ error: true, message: 'Không tìm thấy quản trị để sửa' });
        let updateID = await QUANTRI_MODEL.findOneAndUpdate({ TenTaiKhoan: TenTaiKhoan }, { HoTen, DiaChi, SoDienThoai, Email, HinhAnh }, { new: true });
        return resolve({ error: false, data: updateID });
      } catch (error) {
        return resolve({ error: true, message: error.message });
      }
    });
  }
  static delete(IDQuanTri) {
    return new Promise(async resolve => {
      try {
        let checkID = await QUANTRI_MODEL.findOne({ IDQuanTri: IDQuanTri })
        if (!checkID) return resolve({ error: true, message: 'Không tìm thấy quản trị để xóa' });
        let deleteQuanTri = await QUANTRI_MODEL.findOneAndDelete({ IDQuanTri: IDQuanTri });
        await TAIKHOAN_MODELBD.deleteOne({ TenTaiKhoan: checkID.TenTaiKhoan })
        return resolve({ error: false, data: deleteQuanTri })
      } catch (error) {
        return resolve({ error: true, message: error.message })
      }
    });
  }
}