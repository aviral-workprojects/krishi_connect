import React, { useState } from "react";
import axios from "axios";

export default function CropRecommendationForm() {
  const [form, setForm] = useState({
    crop: "",
    soil_type: "",
    season: "",
    rainfall_mm: "",
    temperature_c: "",
    demand_index: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("/api/ml/recommend", {
        ...form,
        rainfall_mm: parseFloat(form.rainfall_mm),
        temperature_c: parseFloat(form.temperature_c),
        demand_index: parseFloat(form.demand_index)
      });
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-green-700">🌱 Crop Recommendation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-gray-700">Crop</label>
          <input
            type="text"
            name="crop"
            value={form.crop}
            onChange={handleChange}
            placeholder="e.g. Wheat"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Soil Type</label>
          <select
            name="soil_type"
            value={form.soil_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="clay">Clay</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Season</label>
          <select
            name="season"
            value={form.season}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="kharif">Kharif</option>
            <option value="rabi">Rabi</option>
            <option value="zaid">Zaid</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Rainfall (mm)</label>
          <input
            type="number"
            name="rainfall_mm"
            value={form.rainfall_mm}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Temperature (°C)</label>
          <input
            type="number"
            name="temperature_c"
            value={form.temperature_c}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Demand Index (0-1)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            name="demand_index"
            value={form.demand_index}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Predicting..." : "Get Recommendation"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          {result.error ? (
            <p className="text-red-600">❌ {result.error}</p>
          ) : (
            <>
              <h3 className="text-lg font-semibold">✅ Result</h3>
              <p>
                <strong>Predicted Price per Kg:</strong>{" "}
                {result.predicted_price_per_kg} INR
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
