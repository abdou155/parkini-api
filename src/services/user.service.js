const User = require("../models/user.model");
const otpGenerator = require('otp-generator');

exports.listUsers = async (req, res) => {
    try {
        // filters [ lead , customer , vip ]
        const filter = req.query.filter
        if( !filter ){
            let users = await User.find({}).sort( {"_id" : -1 } );
            res.status(200).json({ success: true, message: 'List of Customers' ,  data : users });

        }else{
            let users = await User.find({ type : filter}).sort( {"_id" : -1 } );
            res.status(200).json({ success: true, message: 'List of Customers' ,  data : users });

        }
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.findUser = async (req, res) => {
    try {
        const phone = req.params.phone
        let user = await User.findOne({phone});
        if( user ){
            res.status(200).json({ success: true, message: 'User found successfuly' ,  data : user });
        }else{
            res.status(404).json({ success: false, message: 'User not found'  });
        }
        
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const phone = req.params.phone
        await User.findOneAndDelete({phone})
        res.status(204).json({ success: true, message: 'User deleted successfuly'  });
    } catch (error) {
        res.status(400).send(error);
    }
};


// ONE TIME PASSWORD 

exports.otpGenerate = async (req, res) => {
    try {

        const { phone } = req.body;
        const user = await User.findOne({ phone : phone });
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        
        if ( user ) {
            user.otp = otp;
            await user.save();
        }else {
            const newUser = new User({ phone : phone , otp : otp , type : "lead" });
            await newUser.save()
        }

        //TODO:send OTP
        req.session.phone = phone;
        res.status(201).json({ success: true, message: 'OTP code sent' , otpCode : otp });

    } catch (error) {
        res.status(400).send(error);
    }
};



exports.otpValidate = async (req, res) => {
    try {

        const { otp } = req.body;
        const phone = req.session.phone;
        let user = await User.findOne({ phone : phone });
        if( user ){
            const isOTPValid = verifyOTP(otp, user.otp);
            if (isOTPValid) {
              // OTP is valid
              // Clear the session after successful OTP verification
              req.session.destroy();
              res.json({ success: true, message: 'OTP verification successful.' });
            } else {
              // OTP is invalid
              res.json({ success: false, message: 'OTP verification failed.' });
            }
        }else{
            res.status(500).json({ success: false, message: 'Failed to verify OTP.' });
        }
        
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { phone } = req.body
        let user = await User.findOne({ phone : phone });
        user.first_name = req.body.first_name,
        user.last_name = req.body.last_name,
        user.email = req.body.email,
        user.car_mat = req.body.car_mat,
        await user.save();
        res.status(200).json({ success: true, message: 'Customer updated successfuly' , data : user });
    } catch (error) {
        res.status(400).send(error);
    }
};


const verifyOTP = (userOTP, storedOTP) => {
    return userOTP === storedOTP;
};