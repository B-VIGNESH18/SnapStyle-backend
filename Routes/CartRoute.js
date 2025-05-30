import express from 'express';
import { getUserCart, addToCart, updateCart } from '../Controllers/CartController.js';
import authUser from '../Middleware/Auth.js';

const cartRouter = express.Router();

cartRouter.post('/get', authUser, getUserCart); 
cartRouter.post('/add', authUser, addToCart);
cartRouter.post('/update', authUser, updateCart);

export default cartRouter;
