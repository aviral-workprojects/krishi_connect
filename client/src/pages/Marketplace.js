import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getMarketTrends } from "../services/mlService";

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [filters, setFilters] = useState({ q:'', location:'', minPrice:'', maxPrice:'' });
  const [trends, setTrends] = useState(null);
  const navigate = useNavigate();

  // Fetch crops from backend
  const fetchCrops = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/buyers/crops?${params}`);
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  // Fetch ML-powered market trends
  const fetchTrends = async () => {
    try {
      const data = await getMarketTrends();
      setTrends(data);
    } catch (err) {
      console.error("Error fetching trends:", err);
    }
  };

  useEffect(() => {
    fetchCrops();
    fetchTrends();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Marketplace</h1>

      {/* ML Market Trends Section */}
      {trends && (
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Predicted Market Trends:</h3>
          <pre className="text-sm">{JSON.stringify(trends, null, 2)}</pre>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input placeholder="Search crop" value={filters.q}
               onChange={e=>setFilters({...filters,q:e.target.value})}
               className="border p-2"/>
        <input placeholder="Location" value={filters.location}
               onChange={e=>setFilters({...filters,location:e.target.value})}
               className="border p-2"/>
        <input placeholder="Min Price" value={filters.minPrice}
               onChange={e=>setFilters({...filters,minPrice:e.target.value})}
               className="border p-2"/>
        <input placeholder="Max Price" value={filters.maxPrice}
               onChange={e=>setFilters({...filters,maxPrice:e.target.value})}
               className="border p-2"/>
        <button onClick={fetchCrops}
                className="bg-green-600 text-white px-4 rounded">Filter</button>
      </div>

      {/* Crop Listings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crops.map(c=>(
          <div key={c.id} className="border p-4 rounded shadow bg-white">
            <h3 className="font-bold">{c.name}</h3>
            <p>{c.quantityKg} kg @ ₹{c.pricePerKg}/kg</p>
            <p>Farmer: {c.farmer?.name}</p>
            <p>Location: {c.location}</p>
            <button onClick={()=>navigate("/checkout",{state:{crop:c}})}
              className="mt-2 bg-green-700 text-white px-3 py-1 rounded">Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
