import React from "react";
import axios from "axios";

const Checkout = ({ amount, buyerId, farmerId }) => {
  const handlePayment = async () => {
    try {
      // Create order on backend
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/orders/create`,
        { amount, buyerId, farmerId }
      );

      const { order } = data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Kisan Bazaar Direct",
        description: "Crop Purchase",
        order_id: order.id,
        handler: async function (response) {
          // Verify payment on backend
          await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment successful!");
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Pay ₹{amount}
    </button>
  );
};

export default Checkout;
