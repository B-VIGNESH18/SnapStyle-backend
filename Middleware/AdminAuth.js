// 
import jwt from "jsonwebtoken";

const AdminAuth = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if decoded token contains admin email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Not authorized as admin",
      });
    }

    // Pass user info along if needed
    req.user = decoded;
    next();
  } catch (error) {
    console.error("AdminAuth error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default AdminAuth;


// import jwt from 'jsonwebtoken';

// const AdminAuth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     console.log("Token from header:", token);
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized, please log in.",
//       });
//     }

//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);

//     // Validate that the decoded token contains the correct admin email (or other identifier)
//     if (token_decode.email !== process.env.ADMIN_EMAIL) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized, please log in.",
//       });
//     }

//     // Add decoded data to request for further use if needed
//     req.user = token_decode;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({
//       success: false,
//       message: "Invalid token, please log in again.",
//     });
//   }
// };

// export default AdminAuth;
