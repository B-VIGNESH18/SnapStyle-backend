// 
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
const PORT = process.env.PORT;

// MongoDB & Cloudinary
connectDB();
connectcloudinary();

// CORS middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://snap-style-frontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Ensure Express handles JSON
app.use(express.json());

// Allow preflight requests for all routes
app.options("*", cors());

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Test endpoint
app.get("/", (req, res) => {
  res.send("API is working fine");
  console.log("API is working");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

