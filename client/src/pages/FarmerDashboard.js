import React, { useState, useEffect } from "react";
import api from "../api";

export default function FarmerDashboard() {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantityKg: "",
    pricePerKg: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load farmer’s crops
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await api.get("/api/farmers/crops");
        setCrops(res.data);
      } catch (err) {
        console.error("Error fetching crops:", err);
        setError("Failed to load your crops");
      }
    };
    fetchCrops();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add new crop
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/api/farmers/crops", form);
      setCrops([res.data, ...crops]); // prepend new crop
      setForm({ name: "", quantityKg: "", pricePerKg: "", location: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">🌱 Farmer Dashboard</h2>

      {/* Add Crop Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded mb-6 space-y-3"
      >
        <input
          type="text"
          name="name"
          placeholder="Crop Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          name="quantityKg"
          placeholder="Quantity (kg)"
          value={form.quantityKg}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          name="pricePerKg"
          placeholder="Price per Kg (₹)"
          value={form.pricePerKg}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          {loading ? "Adding..." : "Add Crop"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* My Crops */}
      <h3 className="text-xl font-semibold mb-2">🌾 My Crops</h3>
      {crops.length === 0 ? (
        <p className="text-gray-600">No crops yet. Add one above.</p>
      ) : (
        <ul className="space-y-3">
          {crops.map((crop) => (
            <li
              key={crop.id}
              className="bg-white shadow p-3 rounded flex justify-between"
            >
              <div>
                <p className="font-semibold">{crop.name}</p>
                <p className="text-sm text-gray-600">
                  {crop.quantityKg} kg @ ₹{crop.pricePerKg}/kg
                </p>
                <p className="text-sm text-gray-500">{crop.location}</p>
              </div>
              <span className="text-gray-500">ID: {crop.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
