const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const Setting = require("../models/setting.model");
const User = require("../models/user.model");
const Reservation = require("../models/reservation.model");
const Payment = require('../models/payment.model');
const Spot = require('../models/spot.model');


exports.createAdmin = async (req, res) => {
  const { email, password, role, firstName, lastName } = req.body;
  try {
    // Check if a user with the same email already exists
    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
        data: existingUser,
      });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newAdmin = new Admin({
      email,
      passwordHash,
      role,
      firstName,
      lastName,
    });

    await newAdmin.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
      data: newAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare the provided password with the stored password hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }
    res
      .status(200)
      .json({ success: true, message: "Login successful", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    if (admins) {
      res
        .status(200)
        .json({ success: true, message: "List of Admins", data: admins });
    } else {
      res
        .status(404)
        .json({ success: false, message: "List of Admins not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.findAdmin = async (req, res) => {
  try {
    const id = req.params.id;
      // https://parkini.com/admin/6454da20f552beae36929cb0 => id 
    const admin = await Admin.findById(id);
    if (admin) {
      res
        .status(200)
        .json({ success: true, message: "Admin found", data: admin });
    } else {
      res.status(404).json({ success: false, message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.editAdmin = async (req, res) => {
  try {
    const {_id , firstName , lastName , email , password} = req.body;
    const admin = await Admin.findById(_id);
    if (!admin) {
      res.status(404).json({ success: false, message: "Admin not found" });
    } else {
      admin.firstName = firstName
      admin.lastName = lastName
      admin.email = email
      admin.password = await bcrypt.hash(password, 10);
      admin.save();

      res.status(200).json({ success: true, message: "Admin updated successfuly!" , data : admin });

    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id
        await Admin.findOneAndDelete({_id : id})
        res.status(204).json({ success: true, message: 'Admin deleted successfuly'  });
    } catch (error) {
        res.status(400).send(error);
    }
  };


const isDateInCurrentMonth = async (date) => {
  const currentDate = new Date();
  return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
}


const checkVips = async (value) => {
  const users = await User.find({type : { $ne : "lead"}})
  if ( users ){
     users.map(async (el) => {
        const reservations = await Reservation.find({user_id : el._id , status : "approved" })
        let nbRes = 0 ;
        await reservations.map((item) => {
          if( isDateInCurrentMonth(item.checkin) ){
            nbRes = nbRes + 1 ;
          }
        })
        if ( nbRes >= value ){
          await User.findByIdAndUpdate(el._id , {type : "vips" })
        }else{
          await User.findByIdAndUpdate(el._id , {type : "customer" })
        }
     })     
  }
}

exports.configVip = async (req, res) => {
  try {
      const { code , content , is_active } = req.body
      let config = await Setting.findOne({code : code})
      if(config){
        config.content = content
        config.is_active = is_active
        config.save()
        if (code == "VIP_LEVEL") {
          await checkVips(content)
        }
        res.status(200).json({ success: true, message: 'Config updated successfuly' , data : config });
      }else{
        const newConfig = new Setting({
          code : code ,
          content : content ,
          is_active : is_active
        })
        newConfig.save()
        if (code == "VIP_LEVEL") {
          await checkVips(content)
        }
        res.status(200).json({ success: true, message: 'Config added successfuly' , data : newConfig });
      }
  } catch (error) {
      res.status(400).send(error);
  }
};

exports.findConfigVip = async (req, res) => {
  try {
      const code = req.params.code
      let config = await Setting.findOne({code : code})
      if(config){
        res.status(200).json({ success: true, message: 'Config founded successfuly' , data : config });
      }else{
        res.status(404).json({ success: false, message: 'Config not Found' });
      }
  } catch (error) {
      res.status(400).send(error);
  }
};

exports.getReports = async  (req, res) => {
  try {
    let reports = {
       chart:{},
       stats : {}
    }

    const customerCount = await User.countDocuments({})
    reports.stats.customerCount = customerCount;
   
   
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const revenu = await Payment.aggregate([
      {
        $match: {
          date: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ])
    reports.stats.totalRevenu = revenu[0]?.totalAmount ?? 0;

    const vipCount = await User.countDocuments({type : "vips"})
    reports.stats.vipCount = vipCount;

    const reservedSpots = await Spot.countDocuments({status : "occupied"})
    reports.stats.reservedSpots = reservedSpots;

    const labels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Fetch reservations data
    const reservationsPromise = await Reservation.aggregate([
      {
        $group: {
          _id: { $month: '$_id' },
          count: { $sum: 1 },
        },
      },
    ])
      .sort({ _id: 1 })
      .exec();

    // Fetch customers data
    const customersPromise = await User.aggregate([
      {
        $group: {
          _id: { $month: '$_id' },
          count: { $sum: 1 },
        },
      },
    ])
      .sort({ _id: 1 })
      .exec();

  const reservationsCounts = Array(12).fill(0);
  const customersCounts = Array(12).fill(0);
  await reservationsPromise.forEach((item) => {
    const month = item._id - 4; // Adjust the month index based on your data
    reservationsCounts[month] = item.count;
  });

  await customersPromise.forEach((item) => {
    const month = item._id - 4; // Adjust the month index based on your data
    customersCounts[month] = item.count;
  });


  const response = {
    labels,
    datasets: [
      {
        label: "Reservations",
        color: "info",
        data: reservationsCounts,
      },
      {
        label: "Customers",
        color: "dark",
        data: customersCounts,
      },
    ],
  };

  reports.chart = response

  res.status(200).json({ success: true, message: 'Reports founded successfuly' , data : reports });
  } catch (error) {
    console.log("🚀 ~ file: admin.service.js:216 ~ exports.getReports= ~ error:", error)
    res.status(400).json({ message: "An error occurred" });
  }
};

///async await => asyncronos functions

/* function nour  () { 
    

   let aziz = await  getAziz()
    let abdess =  await getAbdes()

    postAzizetAbdes(aziz ,  abdess)

} */


// get aziz --> tjib aziz ml base ->> temps de reponse inconnu
// get abdess --> abdes ml base -->> temps de reponse inconnu



// const  
// let / var 