import React, { useState } from "react";
import api from "../api";

export default function CropRecommendationForm() {
  const [form, setForm] = useState({
    crop: "",
    soil_type: "",
    season: "",
    rainfall_mm: "",
    temperature_c: "",
    demand_index: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/ml/recommend", form);
      setResult(response.data);
    } catch (err) {
      setError("Failed to fetch recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">🌱 Crop Recommendation</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="crop"
          placeholder="Crop"
          value={form.crop}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="soil_type"
          placeholder="Soil Type"
          value={form.soil_type}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="season"
          placeholder="Season"
          value={form.season}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          name="rainfall_mm"
          placeholder="Rainfall (mm)"
          value={form.rainfall_mm}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          name="temperature_c"
          placeholder="Temperature (°C)"
          value={form.temperature_c}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          name="demand_index"
          placeholder="Demand Index"
          value={form.demand_index}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Loading..." : "Get Recommendation"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold">Recommendation Result:</h3>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
