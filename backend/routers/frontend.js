const route = require('express').Router();
const KHOAHOC_MODEL = require('../models/KhoaHoc');
const LOPHOCPHAN_MODEL = require('../models/LopHocPhan');

route.get('/khoahoc', async (req, res) => {
    let result = await KHOAHOC_MODEL.getList();
    return res.json({result});
});
route.get('/lophocphan', async (req, res) => {
    let result = await LOPHOCPHAN_MODEL.getList();
    return res.json({result});
});

module.exports = route;