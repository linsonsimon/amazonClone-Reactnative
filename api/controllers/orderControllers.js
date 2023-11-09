const Order = require("../models/order");

//endpoint to store all orders
const createOrders = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      cartItem,
      totalPrice,
      shippingAddress,
      paymentMethod,
    } = req.body;

    //create an array of product objects from the cart Items
    const products = cartItem.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    //create a new order
    const order = new Order({
      user: req.user._id,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      paymentId: razorpay_payment_id ? razorpay_payment_id : "",
    });

    await order.save();

    res.status(200).json({ message: "order created successfully" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("user");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "no orders found " });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

module.exports = { createOrders, getOrders };
