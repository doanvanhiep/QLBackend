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
                //let content = "<h1>Tài khoản đăng nhập vào hệ thống quản lý trung tâm anh ngữ</h1> <h2>Tên tài khoản: " + TenTaiKhoan + "<h2> <h2>Mật khẩu: " + MatKhau + "<h2>";
                let datasample = '<head>' +
                    '</head>' +
                    '<body style="background-color: #ecebf0; font-family: Verdana;font-size:13px;">' +
                    '<table style="min-width:320px;width:100%;margin:0;padding:0" border="0" cellspacing="0" cellpadding="0">' +
                    '<tbody>' +
                    '<tr>' +
                    '<td style="padding-top:30px;padding-bottom:30px" align="center" bgcolor="#ecebf0">' +
                    '<table style="max-width:600px;min-width:320px;width:100%;margin:0;padding:0" border="0" cellspacing="0" cellpadding="0">' +
                    '<tbody>' +
                    '<tr>' +
                    '<td bgcolor="#ffffff">' +
                    '<table style="min-width:240px;width:100%;padding:0;margin:auto" border="0" cellspacing="0" cellpadding="0">' +
                    '<tbody>' +
                    '<tr>' +
                    '<td style="padding-top:10px;padding-left:40px;padding-right:40px;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#e6e6e6" bgcolor="#ffffff">' +
                    '<h3>Trung tâm anh ngữ</h3>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td><p style="border-top:solid 2px #0070C0;font-size:1px;margin:0px auto;width:100%;"> </p></td>' +
                    '<td><p style="border-top:solid 2px #0070C0;font-size:1px;margin:0px auto;width:100%;"> </p></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="padding-top:10px;padding-left:40px;padding-right:40px" bgcolor="#ffffff">' +
                    '<b><font style="color:#0070C0;font-style:italic" size="3">{{TieuDe}}</font></b>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#e6e6e6;padding:0px 40px 15px 40px">' +
                    '<p style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;line-height:10px"> Xin chào <strong><i>{{HoTen}}</i></strong>, </p>' +
                    '<p style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;line-height:10px"> Hôm nay <strong><i>{{NgayThang}}</i></strong> </p>' +
                    '<p style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;line-height:20px">{{NoiDung}} </p>' +
                    '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>' +
                    '<table style="min-width:320px;width:100%;padding:0;margin:auto;margin-bottom:36px" border="0" cellspacing="0" cellpadding="0">' +
                    '<tbody>' +
                    '<tr>' +
                    '<td width="40">&nbsp;</td>' +
                    '<td style="padding-top:20px;font-family:Open Sans,Tahoma,Helvetica,Verdana;font-style:italic;font-size:14px;color:#2e363a;line-height:21px;margin-top:2px">' +
                    'Trân trọng,<br>Trung tâm anh ngữ<br>' +
                    '<a style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;text-decoration:none !important" href="mailto:info@primas.net">trungtamanhngu@gmail.com</a>&nbsp;&nbsp;&nbsp;' +
                    '<a style="font-family:Open Sans,Tahoma,Helvetica,Verdana;font-size:14px;color:#2e363a;text-decoration:none !important" href="tel:+18884774627">+84 123 123 123</a>' +
                    '</td>' +
                    '<td width="40">' +
                    '&nbsp;' +
                    '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>' +
                    '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>' +
                    '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>' +
                    '</body>';
                let NoiDung = 'Thông tin tài khoản đăng nhập của bạn <br> Tên tài khoản: <strong>'+TenTaiKhoan+'</strong> <br> Mật khẩu: <strong>'+MatKhau+'</strong>';
                let date_ob = new Date();
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                let content = datasample.replace('{{TieuDe}}', "Tài khoản đăng nhập");
                content = content.replace('{{HoTen}}', HoTen);
                content = content.replace('{{NgayThang}}', date + "-" + month + "-" + year);
                content = content.replace('{{NoiDung}}', NoiDung);
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
    static updateThongTinCaNhan({ TenTaiKhoan, HoTen, DiaChi, SoDienThoai, Email, HinhAnh }) {
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