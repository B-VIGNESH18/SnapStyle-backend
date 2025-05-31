// // 
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./Config/Mongodb.js";
// import connectcloudinary from "./Config/cloudinary.js";
// import userRouter from "./Routes/UserRoute.js";
// import productRouter from "./Routes/ProductRoute.js";
// import cartRouter from "./Routes/CartRoute.js";
// import orderRouter from "./Routes/OrderRoute.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT;

// // Connect DB & Cloudinary
// connectDB();
// connectcloudinary();

// // Allowed origins
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://snap-style-frontend.vercel.app",
// ];

// // Shared CORS config
// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log("CORS origin check:", origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.error("Blocked by CORS:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };
  

// // Apply CORS
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Preflight support for all routes

// // JSON parsing
// app.use(express.json());

// // API routes
// app.use("/api/user", userRouter);
// app.use("/api/product", productRouter);
// app.use("/api/cart", cartRouter);
// app.use("/api/order", orderRouter);

// // Root endpoint
// app.get("/", (req, res) => {
//   res.send("API is working fine");
//   console.log("API is working");
// });
// // Global Error Handler - ensures CORS headers are sent on errors
// app.use((err, req, res, next) => {
//     console.error(err.stack);
  
//     // Set CORS headers manually to avoid CORS blocking on errors
//     res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
//     res.status(err.status || 500).json({
//       success: false,
//       message: err.message || "Internal Server Error",
//     });
//   });
  
// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Config/Mongodb.js";
import connectcloudinary from "./Config/cloudinary.js";
import userRouter from "./Routes/UserRoute.js";
import productRouter from "./Routes/ProductRoute.js";
import cartRouter from "./Routes/CartRoute.js";
import orderRouter from "./Routes/OrderRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB & Cloudinary
connectDB();
connectcloudinary();

// Allowed origins list — exactly match your frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://snap-style-frontend.vercel.app",
];

// CORS options with dynamic origin check
const corsOptions = {
  origin: (origin, callback) => {
    // Log origin for debugging
    console.log("CORS origin check:", origin);

    // Allow requests with no origin like Postman or curl
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // for legacy browsers support
};

// Apply CORS middleware globally with these options
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // enable preflight for all routes

// JSON body parsing middleware
app.use(express.json());

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API is working fine");
  console.log("API is working");
});

// Global error handler — make sure CORS headers are sent on errors
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Set CORS headers manually to prevent CORS issues on error response
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
