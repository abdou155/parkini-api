const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservation.service');

/* router.get('/', reservationService.listReservation);
router.get('/:id', reservationService.findReservation);
router.post('/:id/update', reservationService.updateReservation);
router.delete('/:id', reservationService.deleteUser); */

router.get('/', reservationService.listReservation);
router.get('/:id', reservationService.getReservationById);
router.post('/', reservationService.createReservation);
router.post('/payment', reservationService.processPayment);

router.delete('/:id', reservationService.deleteReservation);
router.get('/cancel/:id', reservationService.cancelReservation);


module.exports = router;
