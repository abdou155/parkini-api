const express = require('express');
const router = express.Router();
const adminService = require('../services/admin.service');


//http methods - verbs ( get , post , put , delete )

router.get('/', adminService.listAdmins);   // List all admins
router.get('/:id', adminService.findAdmin); //  find admin by id
router.post('/create', adminService.createAdmin); // create admin
router.post('/login', adminService.loginAdmin);
router.put('/update', adminService.editAdmin);
router.delete('/:id', adminService.deleteAdmin);

//settings
router.post('/config/vip', adminService.configVip);   // ajouter une configuration pour vips
router.get('/config/vip/:code', adminService.findConfigVip); // trouver la config

//reports
router.post('/reports', adminService.getReports); // reports for dashboard




module.exports = router;
