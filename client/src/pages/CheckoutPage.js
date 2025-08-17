import React, { useState } from "react";
import api from "../api";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]); // Example format: [{ cropId, name, quantityKg, pricePerKg }]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper: calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.quantityKg * item.pricePerKg,
    0
  );

  const handleCheckout = async () => {
    if (!cart.length) return alert("Cart is empty!");
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create order in backend
      const res = await api.post("/api/orders/create", {
        items: cart.map((item) => ({
          cropId: item.cropId,
          quantityKg: item.quantityKg,
        })),
      });

      const { orderId, razorpayOrderId, amount, currency } = res.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // from .env
        amount,
        currency,
        name: "Kisan Bazaar Direct",
        description: "Crop purchase",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            await api.post("/api/orders/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("✅ Payment successful!");
            setCart([]);
          } catch (err) {
            console.error("Verification failed:", err);
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: "Buyer",
          email: "buyer@example.com",
        },
        theme: {
          color: "#10B981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Checkout</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow p-4 rounded">
          <ul className="divide-y">
            {cart.map((item, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>
                  {item.name} ({item.quantityKg} kg)
                </span>
                <span>₹{item.pricePerKg * item.quantityKg}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between font-bold">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
