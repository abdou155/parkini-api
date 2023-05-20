const express = require('express');
const router = express.Router();
const adminService = require('../services/admin.service');

router.get('/', adminService.listAdmins);
router.get('/:id', adminService.findAdmin);
router.post('/create', adminService.createAdmin);
router.post('/login', adminService.loginAdmin);
//router.post('/logout', adminService.logoutAdmin);
router.delete('/:id', adminService.deleteAdmin);


module.exports = router;
