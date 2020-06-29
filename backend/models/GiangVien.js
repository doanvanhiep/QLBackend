const GIANGVIEN_MODEL = require('../database/GiangVien-Coll');
const TAIKHOAN_MODEL = require('../models/TaiKhoan');
const ServiceMail = require('../Service/Mail/mail');
const THONGTINLOPHOC_MODEL = require('../database/ThongTinLopHoc-Coll');
const TAIKHOAN_MODELBD = require('../database/TaiKhoan-Coll');
//send Mail
var multer = require('multer');
const uploadfile = multer();
var nodemailer = require('nodemailer');
module.exports = class GiangVien extends GIANGVIEN_MODEL {
    static getListAll() {
        return new Promise(async resolve => {
            try {
                let data = await GIANGVIEN_MODEL.find();
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách giảng viên' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getList() {
        return new Promise(async resolve => {
            try {
                let data = await GIANGVIEN_MODEL.find({ TrangThai: 1 });
                if (!data)
                    return resolve({ error: true, message: 'Không thể lấy danh sách giảng viên' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static getGiangVienByTenTaiKhoan(TenTaiKhoan) {
        return new Promise(async resolve => {
            try {
                let data = await GIANGVIEN_MODEL.find({ TrangThai: 1, TenTaiKhoan: TenTaiKhoan });
                if (!data)
                    return resolve({ error: true, message: 'Không tìm thấy giảng viên' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({ HoTen, DiaChi, SoDienThoai, Email, MoTa, HinhAnh, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let lastGV = await GIANGVIEN_MODEL.findOne().sort({ IDGiangVien: -1 });
                let IDGiangVien = 1;
                if (lastGV != null) {
                    IDGiangVien = lastGV.IDGiangVien + 1;
                }
                let TrangThai = 1
                let TenTaiKhoan = "GV" + IDGiangVien;
                let GiangVien = new GIANGVIEN_MODEL({ IDGiangVien, TenTaiKhoan, HoTen, DiaChi, SoDienThoai, Email, MoTa, HinhAnh, GhiChu, TrangThai });
                let saveGiangVien = await GiangVien.save();
                if (!saveGiangVien) return resolve({ error: true, message: 'Không thể thêm giảng viên' });
                //Tạo tài khoản đồng thời sendmail cho giáo viên
                let MatKhau = TenTaiKhoan + SoDienThoai;
                let Quyen = 2;
                TAIKHOAN_MODEL.add({ TenTaiKhoan, MatKhau, Quyen });
                let attachments = [];
                let maillist = [Email];
                //sendmail
                let content = "<h1>Tài khoản đăng nhập vào hệ thống quản lý trung tâm anh ngữ</h1> <h2>Tên tài khoản: " + TenTaiKhoan + "<h2> <h2>Mật khẩu: " + MatKhau + "<h2>";
                var Mail = new ServiceMail(nodemailer)
                Mail.SendMail("Tài khoản đăng nhập", content, attachments, maillist);
                return resolve({ error: false, data: GiangVien });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({ IDGiangVien, HoTen, DiaChi, SoDienThoai, Email, MoTa, HinhAnh, GhiChu }) {
        return new Promise(async resolve => {
            try {
                let checkID = await GIANGVIEN_MODEL.findOne({ IDGiangVien: IDGiangVien });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy giảng viên để sửa' });
                let updateID = await GIANGVIEN_MODEL.findOneAndUpdate({ IDGiangVien: IDGiangVien }, { HoTen, DiaChi, SoDienThoai, Email, MoTa, HinhAnh, GhiChu }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static updateThongTinCaNhan({ TenTaiKhoan,HoTen, DiaChi, SoDienThoai, Email, HinhAnh}) {
        return new Promise(async resolve => {
            try {
                let checkID = await GIANGVIEN_MODEL.findOne({ TenTaiKhoan: TenTaiKhoan });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy giảng viên để sửa' });
                let updateID = await GIANGVIEN_MODEL.findOneAndUpdate({ TenTaiKhoan: TenTaiKhoan }, { HoTen, DiaChi, SoDienThoai, Email, HinhAnh }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDGiangVien) {
        return new Promise(async resolve => {
            try {
                let checkID = await GIANGVIEN_MODEL.findOne({ IDGiangVien: IDGiangVien })
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy giảng viên để xóa' });
                let deleteGiangVien = await GIANGVIEN_MODEL.findOneAndDelete({ IDGiangVien: IDGiangVien });
                await THONGTINLOPHOC_MODEL.deleteMany({ IDGiangVien: IDGiangVien });
                await TAIKHOAN_MODELBD.deleteOne({ TenTaiKhoan: checkID.TenTaiKhoan })
                resolve({ error: false, data: deleteGiangVien })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }
        });
    }
    static UpdateState(IDGiangVien, TrangThai) {
        return new Promise(async resolve => {
            try {
                let checkID = await GIANGVIEN_MODEL.findOne({ IDGiangVien: IDGiangVien });
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy giảng viên' });
                let updateID = await GIANGVIEN_MODEL.findOneAndUpdate({ IDGiangVien: IDGiangVien }, { TrangThai }, { new: true });
                await TAIKHOAN_MODELBD.findOneAndUpdate({ TenTaiKhoan: checkID.TenTaiKhoan }, { TrangThai }, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}