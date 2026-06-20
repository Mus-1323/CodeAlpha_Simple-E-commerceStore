const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      image: String,
      quantity: Number,
    }
  ],
  totalAmount: Number,
  customerName: String,
  address: String,
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
}
});

module.exports = mongoose.model("Order", orderSchema);