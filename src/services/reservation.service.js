const Reservation = require("../models/reservation.model");
const Setting = require("../models/setting.model");
const Spot = require('../models/spot.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const Payment = require('../models/payment.model');
const { v4: uuidv4 } = require('uuid');

// Create a new reservation
exports.createReservation = async (req, res) => {
    try {

        const { user_id , spot_id } = req.body ;
        const user = await User.findById(user_id);
        const spot = await Spot.findById(spot_id);

        if( !user._id ) {
            return res.status(404).send({message: 'User not found.'});
        }

        if( !spot_id ) {
            return res.status(404).send({message: 'Spot not found.'});
        }

        const reservation = new Reservation(req.body);
        await reservation.save();
        

        user.reservations.push(reservation._id);
        await user.save();

        spot.reservations.push(reservation._id);
        spot.status = "occupied";
        await spot.save();
        
        console.log("🚀 ~ file: reservation.service.js:43 ~ exports.createReservation= ~ user_id:", user_id)

        await checkVip(user_id)


        res.status(201).send(reservation);

    } catch (error) {
        res.status(400).send(error);
    }
};

const isDateInCurrentMonth = async (date) => {
    const currentDate = new Date();
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  }

const checkVip = async (user_id) => {
    console.log("🚀 ~ file: reservation.service.js:53 ~ checkVip ~ user_id:", user_id)
    const config = await Setting.findOne({ code : "VIP_LEVEL"})
    const vip_level = config.content;
    const reservations = await Reservation.find({user_id : user_id , status : "approved" })
    console.log("🚀 ~ file: reservation.service.js:57 ~ checkVip ~ reservations:", reservations)
    let nbRes = 0 ;
    await reservations.map((item) => {
        if( isDateInCurrentMonth(item.checkin) ){
            nbRes = nbRes + 1 ;
        }
    })
    if ( nbRes >= vip_level ){
        console.log("🚀 ~ file: reservation.service.js:61 ~ checkVip ~ vip_level:", vip_level)
        console.log("🚀 ~ file: reservation.service.js:61 ~ checkVip ~ nbRes:", nbRes)
        await User.findByIdAndUpdate(user_id , {type : "vips" })
        await pushNotif("You are promoted to a VIP member" , user_id)
    }
    return true;
}

exports.listReservation = async (req, res) => {
    try {
        const filter = req.query.filter
        if(!filter){
            const reservations = await Reservation.find().populate('user_id').populate({ 
                path: 'spot_id',
                populate: {
                  path: 'parking_id',
                  model: 'Parking'
                } 
             }).populate('payment_id')
            res.status(200).json({ success: true, message: 'Reservations found successfuly' , data : reservations }); 
        }else{
            const reservations = await Reservation.find({status : filter}).populate('user_id').populate({ 
                path: 'spot_id',
                populate: {
                  path: 'parking_id',
                  model: 'Parking'
                } 
             }).populate('payment_id')
            res.status(200).json({ success: true, message: 'Reservations found successfuly' , data : reservations });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const id = req.params.id ;
        const reservation = await Reservation.findById(id).populate('payment_id').populate('user_id').populate({ 
            path: 'spot_id',
            populate: {
              path: 'parking_id',
              model: 'Parking'
            } 
         })
         res.status(200).json({ success: true, message: 'Reservation found successfuly' , data : reservation });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getReservationByUserId = async (req, res) => {
    try {
        const user_id = req.params.id ;
        const reservations = await Reservation.find({user_id}).populate('user_id').populate({ 
            path: 'spot_id',
            populate: {
              path: 'parking_id',
              model: 'Parking'
            } 
         }).populate('payment_id')
         res.status(200).json({ success: true, message: 'Reservations by user found successfuly' , data : reservations });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.processPayment = async (req, res) => {
    try {
        const { reservation_id , amount  } = req.body ;
        const reservation = await Reservation.findById(reservation_id).populate('user_id');
        if ( reservation.payment_id && reservation.status == "approved" ){
            return res.status(400).json({ success: false, message: 'Reservation already payed' , data : reservation });
        }

        if ( reservation.status == "cancelled" ){
            return res.status(400).json({ success: false, message: 'Reservation is cancelled' , data : reservation });
        }

        let promotion_value = 0
        if (reservation.user_id.type == 'vips'){
            const config = await Setting.findOne({ code : "PROMOTION"})
            if (config){
                promotion_value = +config.content
            }
        }

        let payload = new Payment({
            transactionId : uuidv4(),
            amount : amount - ( (amount * promotion_value ) / 100 ),
            date : new Date(),
            reservation_id : reservation_id
        })

        const payment = await payload.save();
        if ( payment._id ){
            await Reservation.findByIdAndUpdate(reservation_id , {payment_id : payment._id , status : "approved" });
        }
        res.status(200).json({ success: true, message: 'Payment created successfuly' , data : payment });
    } catch (error) {
        console.log("🚀 ~ file: reservation.service.js:132 ~ exports.processPayment= ~ error:", error)
        res.status(500).send(error);
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (reservation.status == "pending") {
            await Reservation.findByIdAndUpdate(req.params.id , { status : "cancelled" });
            res.status(200).json({ success: true, message: 'Reservation cancelled successfuly'  });
        }else{
            res.status(400).json({ success: false, message: 'Reservation is not pending'  });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).send({message: 'Reservation not found.'});
        }
        const spot = await Spot.findById(reservation.spot_id);
        const user = await User.findById(reservation.user_id);
        
        spot.reservations.pull(reservation._id);
        await spot.save();

        user.reservations.pull(reservation._id);
        await user.save();

        await Reservation.findOneAndDelete({_id : reservation._id})

        res.status(204).json({ success: true, message: 'Reservation deleted successfuly'  });
    } catch (error) {
        res.status(500).send(error);
    }
};


const pushNotif = async ( message , user_id ) => {
    try {
        const notif = new Notification ({
            message : message,
            notif_at : new Date(),
            user_id : user_id
        })
    
        await notif.save();
        return ;
    } catch (error) {
        console.log("🚀 ~ file: reservation.service.js:212 ~ pushNotif ~ error:", error)
    }  
}