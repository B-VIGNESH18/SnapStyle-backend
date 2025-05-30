// import jwt from 'jsonwebtoken';

// const authUser = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
//   if (!token) {
//     return res.status(401).json({
//       status: "error",
//       message: 'Not Authorized, please login again'
//     });
//   }
//   try {
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.body.userId = token_decode.id; // Attach userId to request
//     next();
//   } catch (error) {
//     console.log("Token verification error:", error);
//     res.status(401).json({
//       status: "error",
//       message: error.message
//     });
//   }
// };

// export default authUser;
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // You can add extra checks here if needed, like user role, etc.

    req.user = decoded; // Save user data for next middleware/controller
    next();
  } catch (error) {
    console.error("authUser error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;

