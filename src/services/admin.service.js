const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");

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

exports.deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id
        await Admin.findOneAndDelete({_id : id})
        res.status(204).json({ success: true, message: 'Admin deleted successfuly'  });
    } catch (error) {
        res.status(400).send(error);
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