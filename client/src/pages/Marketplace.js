import React, { useEffect, useState } from "react";
import api from "../api";

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch crops (with filters)
  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/buyers/crops", {
        params: {
          q: filters.q || undefined,
          location: filters.location || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
        },
      });
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
      setError("Failed to load crops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCrops();
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Marketplace</h2>

      {/* Search & Filters */}
      <form
        onSubmit={handleSearch}
        className="bg-white shadow p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          type="text"
          name="q"
          placeholder="Search crop..."
          value={filters.q}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="md:col-span-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🔍 Search
        </button>
      </form>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading crops...</p>}

      {/* Error */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Crops List */}
      {crops.length === 0 && !loading ? (
        <p className="text-gray-600">No crops found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <li key={crop.id} className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold text-lg">{crop.name}</h3>
              <p className="text-sm text-gray-600">
                {crop.quantityKg} kg available
              </p>
              <p className="text-green-700 font-bold">
                ₹{crop.pricePerKg}/kg
              </p>
              <p className="text-gray-500 text-sm">{crop.location}</p>
              <p className="text-gray-500 text-xs">
                Farmer: {crop.farmer?.name || "Unknown"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
