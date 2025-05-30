import express from 'express';
import {placeOrder,allOrders,updateStatus,userOrders,placeOrderRazorpay,placeOrderStripe} from '../Controllers/OrderController.js';
import AdminAuth from '../Middleware/AdminAuth.js';
import authUser from '../Middleware/Auth.js';

const orderRouter = express.Router();

//Admin Features
orderRouter.post('/list',AdminAuth,allOrders)
orderRouter.post('/status',AdminAuth,updateStatus)

//User Features
orderRouter.post('/userorders',authUser,userOrders)


//Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

export default orderRouter
