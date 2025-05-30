import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Config/Mongodb.js';
import connectcloudinary from './Config/cloudinary.js';
import userRouter from './Routes/UserRoute.js';
import productRouter from './Routes/ProductRoute.js';
import cartRouter from './Routes/CartRoute.js'
import orderRouter from './Routes/OrderRoute.js';

// Load environment variables from .env file
dotenv.config();

// App config
const app = express();
const PORT = process.env.PORT;

//MOngoDb Connection
connectDB()
connectcloudinary()

// Middleware
app.use(cors());
app.use(express.json());

//api routes
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

//API endpoints
app.get('/',(req,res)=>{
    res.send("API is working fine");
    console.log('api is working')

})

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
