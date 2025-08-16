import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const crop = location.state?.crop;
  const token = localStorage.getItem('token');

  if (!crop) return <p>No crop selected</p>;

  const handleCheckout = async () => {
    try {
      // Create order on backend
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/create`,
        { items: [{ cropId: crop.id, quantityKg: 1 }] },  // 1 kg fixed demo
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpayOrderId, amount, currency } = res.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount,
        currency,
        name: "Kisan Bazaar",
        description: `Buying ${crop.name}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          // verify
          await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders/verify`, response, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert("Payment successful");
          navigate('/leaderboard');
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user')).name,
          email: JSON.parse(localStorage.getItem('user')).email,
        },
        theme: { color: "#0f9d58" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      alert(e.response?.data?.error || "Checkout failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      <p>Buying 1kg of <b>{crop.name}</b> @ ₹{crop.pricePerKg}</p>
      <button onClick={handleCheckout} className="bg-green-600 text-white px-4 py-2 rounded mt-4">Pay Now</button>
    </div>
  );
}
