const TAIKHOAN_MODEL = require('../database/TaiKhoan-Coll');
var passwordHash = require('password-hash');
var jwt=require('jsonwebtoken');
module.exports = class TaiKhoan extends TAIKHOAN_MODEL {
    static getList() {
        return new Promise(async resolve => {
            try {
                // let data = await TAIKHOAN_MODEL.find({TrangThai:1});
                let data = await TAIKHOAN_MODEL.aggregate([
                    {
                        $lookup:
                        {
                            from:'quantris',
                            localField:'IDQuanTri',
                            foreignField:'IDQuanTri',
                            as:'IDQuanTri'
                        }
                    }
                ],
                function(err,res){
                    console.log(res);
                });
                if (!data) 
                return resolve({ error: true, message: 'Không thể lấy danh sách quản trị' });
                return resolve({ error: false, data: data })
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static add({IDQuanTri,TenTaiKhoan,MatKhau,Quyen,TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let tenTK=await TAIKHOAN_MODEL.find({TenTaiKhoan:TenTaiKhoan});
                if(tenTK!=null && tenTK.length>0)
                {
                    return resolve({ error: true, message: 'Tên tài khoản đã tồn tại'});
                }
                let lastTaiKhoan=await TAIKHOAN_MODEL.findOne().sort({IDTaiKhoan:-1});
                let IDTaiKhoan=1;
                if(lastTaiKhoan!=null)
                {
                    IDTaiKhoan=lastTaiKhoan.IDTaiKhoan+1;
                }
                MatKhau = passwordHash.generate(MatKhau);

                let TaiKhoan = new TAIKHOAN_MODEL({IDTaiKhoan,IDQuanTri,TenTaiKhoan,MatKhau,Quyen,TrangThai});
                let saveTaiKhoan = await TaiKhoan.save();
                if (!saveTaiKhoan) return resolve({ error: true, message: 'Không thể thêm tài khoản' });
                resolve({ error: false, data: TaiKhoan });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static update({IDTaiKhoan,IDQuanTri,TenTaiKhoan,MatKhau,Quyen,TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await TAIKHOAN_MODEL.findOne({IDTaiKhoan:IDTaiKhoan});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy tài khoản để sửa' });
                let updateID = await TAIKHOAN_MODEL.findOneAndUpdate({ IDTaiKhoan: IDTaiKhoan,IDQuanTri:IDQuanTri }, {TenTaiKhoan,MatKhau,Quyen,TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static delete(IDTaiKhoan)
    {
        return new Promise(async resolve => {
            try {
                let checkID = await TAIKHOAN_MODEL.findOne({IDTaiKhoan:IDTaiKhoan,IDQuanTri:IDQuanTri})
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy tài khoản để xóa'});
                let deleteTaiKhoan = await TAIKHOAN_MODEL.findOneAndDelete({ IDTaiKhoan: IDTaiKhoan,IDQuanTri:IDQuanTri });
                resolve({ error: false, data: deleteTaiKhoan })
            } catch (error) {
                return resolve({ error: true, message: error.message })
            }  
        });
    }
    static updateStatus({IDTaiKhoan,IDQuanTri,TrangThai})
    {
        return new Promise(async resolve => {
            try {
                let checkID = await TAIKHOAN_MODEL.findOne({IDTaiKhoan:IDTaiKhoan});
                if (!checkID) return resolve({ error: true, message: 'Không tìm thấy tài khoản để sửa' });
                let updateID = await TAIKHOAN_MODEL.findOneAndUpdate({ IDTaiKhoan: IDTaiKhoan,IDQuanTri:IDQuanTri }, {TrangThai}, { new: true });
                resolve({ error: false, data: updateID });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static loginTaiKhoan({TenTaiKhoan,MatKhau})
    {
        return new Promise(async resolve => {
            try {
                let tenTK=await TAIKHOAN_MODEL.find({TenTaiKhoan:TenTaiKhoan});
                if(tenTK!=null && tenTK.length>0)
                {
                    let mk=tenTK[0]['MatKhau'];
                    if(passwordHash.verify(MatKhau, mk))
                    {
                        var dataresult=tenTK[0];
                        var token=jwt.sign({quyen:dataresult["Quyen"]},process.env.SECRETKEY||'hiepdv',{algorithm:process.env.ALGRORITHM||'HS256',expiresIn:process.env.EXPIRESIN||'3h'});
                        return resolve({ error: false, data:{token:token,datas:{TenTaiKhoan:dataresult["TenTaiKhoan"],Quyen:dataresult["Quyen"]}}});
                    }
                    return resolve({ error: true, message: 'Mật khẩu không đúng'});
                }
                return resolve({ error: true, message:'Tài khoản không tồn tại'});
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}