import express from 'express';
import { addProduct,listProduct,singleProduct,removeProduct } from '../Controllers/ProductController.js';
import upload from '../Middleware/Multer.js';
import AdminAuth from '../Middleware/AdminAuth.js';

const productRouter=express.Router();


productRouter.post('/add', AdminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',AdminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProduct)


export default productRouter
