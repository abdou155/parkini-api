const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservation.service');

/* router.get('/', reservationService.listReservation);
router.get('/:id', reservationService.findReservation);
router.post('/:id/update', reservationService.updateReservation);
router.delete('/:id', reservationService.deleteUser); */

router.post('/', reservationService.createReservation);


module.exports = router;
