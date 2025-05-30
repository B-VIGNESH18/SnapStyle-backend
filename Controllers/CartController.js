import user from '../Models/UserModel.js';

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await user.findById(userId);

    // Check if user exists
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Initialize cartData if it doesn't exist
    const cartData = userData.cartData || {};

    // Check if item and size exist, and increment or initialize as needed
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    // Update the user's cart data
    await user.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({
      status: "success",
      message: "Added to cart"
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding to the cart",
      error: error.message
    });
  }
};

// Update item quantity in cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await user.findById(userId);

    // Check if user exists
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    if (!userData.cartData || !userData.cartData[itemId] || !userData.cartData[itemId][size]) {
      return res.status(404).json({
        status: "error",
        message: "Item not found in cart"
      });
    }

    // Update cart data
    userData.cartData[itemId][size] = quantity;

    // Save the updated cartData
    await user.findByIdAndUpdate(userId, { cartData: userData.cartData });
    res.status(200).json({
      status: "success",
      message: "Cart updated"
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the cart",
      error: error.message
    });
  }
};

// Get user's cart data

// // 
// const getUserCart = async (req, res) => {
//   try {
//     const userId = req.user.id; // if using middleware that sets req.user

//     const userData = await user.findById(userId);
//     if (!userData) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     const cartData = userData.cartData || {};

//     res.status(200).json({
//       status: "success",
//       message: "Cart data fetched successfully",
//       cartData,
//     });
//   } catch (error) {
//     console.error("Error fetching cart data:", error);
//     res.status(500).json({
//       status: "error",
//       message: "An error occurred while fetching the cart data",
//       error: error.message,
//     });
//   }
// };
// in your cart controller file

const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;  // read userId from request body
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "userId is required"
      });
    }

    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    const cartData = userData.cartData || {};
    res.status(200).json({
      status: "success",
      message: "Cart data fetched",
      cartData,
    });

  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the cart data",
      error: error.message
    });
  }
};


export { getUserCart, addToCart, updateCart };
