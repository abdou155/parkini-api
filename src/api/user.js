const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

router.get('/', userService.listUsers);
router.get('/:phone', userService.findUser);
router.get('/notif/:id', userService.listNotif);
router.post('/register', userService.registerUser);
router.post('/otp/generate', userService.otpGenerate);
router.post('/otp/validate', userService.otpValidate);
router.post('/profile', userService.updateProfile);
router.delete('/:phone', userService.deleteUser);


module.exports = router;
