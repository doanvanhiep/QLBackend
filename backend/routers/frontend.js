const route = require('express').Router();
// const uuidv1 = require('uuidv1');
const KHOAHOC_MODEL = require('../models/KhoaHoc');
const LOPHOCPHAN_MODEL = require('../models/LopHocPhan');
const LOPHOC_MODEL = require('../models/LopHoc');
const ServiceMoMo=require('../Service/Momo/momo');


route.get('/khoahoc', async (req, res) => {
    let result = await KHOAHOC_MODEL.getList();
    return res.json({result});
});
route.get('/lophocphan', async (req, res) => {
    let result = await LOPHOCPHAN_MODEL.getList();
    return res.json({result});
});
route.get('/cahocbuoihocbylophocphan/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan = req.params.IDLopHocPhan; 
    let result = await LOPHOC_MODEL.getListCaBuoiHocByIDLopHocPhan(IDLopHocPhan);
    return res.json({result});
});
route.get('/lophocphan/:IDLopHocPhan', async (req, res) => {
    let IDLopHocPhan = req.params.IDLopHocPhan; 
    let result = await LOPHOCPHAN_MODEL.getLopHocPhanByID(IDLopHocPhan);
    return res.json({result});
});
route.get('/lophoc/:IDLopHocPhan/:IDLopHoc', async (req, res) => {
    let IDLopHocPhan=req.params.IDLopHocPhan;
    let IDLopHoc=req.params.IDLopHoc;
    let result = await LOPHOC_MODEL.getInfoLopHoc(IDLopHocPhan,IDLopHoc);
    return res.json({result});
});

route.post('/sendmomo',async(req,res)=>{
    let { HoTen, SoDienThoai, Email,SoTien} = req.body;
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = date + "-" +(month + 1) + "-" + year;
    var orderId=dateString+"-thanh-toan-hoc-phi-"+SoDienThoai;
    var requestId=currentDate.getTime().toString();
    var MoMo=new ServiceMoMo(res)
    let result=await MoMo.SendMoMo(HoTen,Email,SoDienThoai,SoTien,orderId,requestId);
});
route.post('/thanhtoanmomo',async(req,res)=>{
    let { requestId, errorCode, message} = req.body;
    console.log({ requestId, errorCode, message});
});

module.exports = route;