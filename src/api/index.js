const express = require('express');

const admin = require('./admin');
const parking = require('./parking');
const spot = require('./spot');
const user = require('./user');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/users', user);
router.use('/admins', admin);
router.use('/parkings', parking);
router.use('/spots', spot);

module.exports = router;
