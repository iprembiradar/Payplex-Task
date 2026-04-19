const Order = require("../models/OrderModels");
const Product = require("../models/ProductModels");


////////////////////////////// Place Order/////////////////////////////////////////////////
const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount
    } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order data is incomplete"
      });
    }

    // /////////////////////////////Inventory Update////////////////////////////////////////////////////
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.title}`
        });
      }

      product.stock = product.stock - item.quantity;
      await product.save();
    }

    const order = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      orderStatus: "Processing",
      totalAmount
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.log("PLACE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order"
    });
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.log("GET ALL ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders"
    });
  }
};

//////////////////////////// Get user orders///////////////////////////////////////////////////////////
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.log("GET USER ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders"
    });
  }
};

/////////////////////////////// Get single order////////////////////////////////////////////
const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.log("GET SINGLE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order"
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.log("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};

////////////////////////Cancel Order Logic///////////////////////////////////////////




const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Already delivered or cancelled check
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be cancelled"
      });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled"
      });
    }

    // Inventory restore
    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch (error) {
    console.log("CANCEL ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order"
    });
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getUserOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder
};