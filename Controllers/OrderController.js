import orderModel from "../Models/OrderModel.js";
import userModel from "../Models/UserModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const currency = "USD";
const deliveryCharge = 10;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order using COD
const placeOrder = async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const userId = req.user.id || req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      status: "Order Placed",
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order Placed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Place order using Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const userId = req.user.id || req.user.userId;
    const { origin } = req.headers;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

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
          name: item.name,
        },
        unit_amount: item.price * 100, // assuming item has price property in dollars
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Place order using Razorpay (you can update similarly)
const placeOrderRazorpay = async (req, res) => {
  try {
    // Implement Razorpay logic here with userId from req.user
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// All orders for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error("allOrders error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// User orders for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status from Admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  allOrders,
  updateStatus,
  userOrders,
  placeOrderRazorpay,
  placeOrderStripe,
};
