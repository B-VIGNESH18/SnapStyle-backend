// import products from 'razorpay/dist/types/products.js';/
import orderModel from '../Models/OrderModel.js'
import userModel from '../Models/UserModel.js';
import Stripe from 'stripe';
import dotenv from "dotenv";
dotenv.config();

// global variables
const currency = 'USD'
const deliveryCharge= 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//Placing order using COD

const placeOrder = async (req, res) => {
    try {

        const { userId, items, address, amount } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            status: "Order Placed",
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,  {cartData : {}});

        res.json({
            success: true,
            message: "Order Placed"

        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })

    }

}

//Placing order using stripe

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address, amount } = req.body;
        const { origin } = req.headers;

        const orderData = {
          userId,
          items,
          address,
          amount,
          status: "Order Placed",
          paymentMethod: "Stripe",
          payment: false,
          date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name:item.name
                },
                unit_amount: deliveryCharge*100
            },
            quantity: item.quantity
        }))

        line_items.push({
          price_data: {
            currency: currency,
            product_data: {
              name: 'Delivery Charges',
            },
            unit_amount: deliveryCharge * 100,
          },
          quantity: 1
        });
        const session = await stripe.checkout.sessions.create({
          success_url: "${origin}/verify?success=true&orderId=${newOrder._id }",
            cancel_url: "${origin}/verify?success=false&orderId=${newOrder._id }",
            line_items,
          mode:'payment',
        });

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        });
    }


}

//Placing order using Razorpay

const placeOrderRazorpay = async (req, res) => {
    try {

    } catch (error) {

    }


}

//All orders data for admin panel 
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        console.log("Orders fetched:", orders.length);
        res.json({
            success:true,
            orders
        })

    } catch (error) {
        // console.log(error)
        console.error("allOrders error:", error.message);
        res.json({
            success:false,
            message:error.message
        })

    }


}

//User Order data for Frontend
const userOrders = async (req, res) => {
    try {
        const {userId}=req.body
        const orders= await orderModel.find({userId})
        res.json({
            success:true,
            orders
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })


    }


}

//update order status from Admin panel

const updateStatus = async (req, res) => {
    try {
    const {orderId,status}=req.body
    await orderModel.findByIdAndUpdate(orderId ,{status})
    res.json({
        success:true,
        message:'Status Updated'
    })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })


    }


}


export { placeOrder, allOrders, updateStatus, userOrders, placeOrderRazorpay, placeOrderStripe }



