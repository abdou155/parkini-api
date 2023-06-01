const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservation.service');


router.get('/', reservationService.listReservation);
router.get('/:id', reservationService.getReservationById);
router.get('/user/:id', reservationService.getReservationByUserId);  // lister les reservation pour un client
router.post('/', reservationService.createReservation);
router.post('/payment', reservationService.processPayment); // make payment

router.delete('/:id', reservationService.deleteReservation);
router.get('/cancel/:id', reservationService.cancelReservation); // cancel reservation


module.exports = router;
