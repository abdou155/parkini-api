const express = require('express');
const router = express.Router();
const adminService = require('../services/admin.service');


//http methods - verbs ( get , post , put , delete )

router.get('/', adminService.listAdmins);
router.get('/:id', adminService.findAdmin);
router.post('/create', adminService.createAdmin);
router.post('/login', adminService.loginAdmin);
router.put('/update', adminService.editAdmin);
//router.post('/logout', adminService.logoutAdmin);
router.delete('/:id', adminService.deleteAdmin);

//settings
router.post('/config/vip', adminService.configVip);
router.get('/config/vip/:code', adminService.findConfigVip);




module.exports = router;
