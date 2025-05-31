// import userModel from "../Models/UserModel.js";
// import validator from "validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// //Token creation

// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET);
// };

// //Routes for user login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.json({
//         success: false,
//         message: "User doesn't  exists !",
//       });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       const token = createToken(user._id);
//       res.json({
//         success: true,
//         token,
//       });
//     } else {
//       res.json({
//         success: false,
//         message: "invalid credentials",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// //Route for user register
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     //checking user already exists

//     const exists = await userModel.findOne({ email });
//     if (exists) {
//       return res.json({
//         success: false,
//         message: "User already exists !",
//       });
//     }
//     //validating email format and strong password
//     if (!validator.isEmail(email)) {
//       return res.json({
//         success: false,
//         message: "Please enter a valid email !",
//       });
//     }
//     if (password.length < 8) {
//       return res.json({
//         success: false,
//         message: "Please enter a strong password ! ",
//       });
//     }

//     //Hashing user password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new userModel({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const user = await newUser.save();

//     const token = createToken(user._id);
//     res.json({
//       success: true,
//       token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// //Routes for Admin login
// const adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   if (
//     email === process.env.ADMIN_EMAIL &&
//     password === process.env.ADMIN_PASSWORD
//   ) {
//     const token = jwt.sign(
//       { email }, // Include email for AdminAuth
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.json({
//       success: true,
//       token,
//       message: "Admin logged in",
//     });
//   }

//   return res.status(403).json({
//     success: false,
//     message: "Invalid admin credentials",
//   });
// };
// export { loginUser, registerUser, adminLogin };
// Controllers/UserController.js

// Controllers/authController.js
import userModel from "../Models/UserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Token generator: includes id, email, and role
const createToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// User Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists!" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email!" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "user", // Set default role
    });

    const user = await newUser.save();
    const token = createToken(user);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      message: "Admin logged in",
    });
  }

  return res.status(403).json({
    success: false,
    message: "Invalid admin credentials",
  });
};

export { loginUser, registerUser, adminLogin };

