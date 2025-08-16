import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCropRecommendation } from "../services/mlService";

export default function FarmerDashboard() {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({ name:'', quantityKg:'', pricePerKg:'', location:'' });
  const [recForm, setRecForm] = useState({ soilType: "", season: "", rainfall: "" });
  const [recommendation, setRecommendation] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch existing crops
  const fetchCrops = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/farmers/crops`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  useEffect(() => { fetchCrops(); }, []);

  // Add a new crop
  const addCrop = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/farmers/crops`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name:'', quantityKg:'', pricePerKg:'', location:'' });
      fetchCrops();
    } catch (err) {
      console.error("Error adding crop:", err);
    }
  };

  // Handle crop recommendation request
  const handleRecommend = async () => {
    try {
      const result = await getCropRecommendation(recForm);
      setRecommendation(result);
    } catch (err) {
      console.error("Error fetching recommendation:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Farmer Dashboard</h1>

      {/* Crop Management Section */}
      <form onSubmit={addCrop} className="mb-6 flex gap-2 flex-wrap">
        <input placeholder="Crop Name" value={form.name}
               onChange={e=>setForm({...form, name:e.target.value})}
               className="border p-2"/>
        <input placeholder="Quantity (kg)" value={form.quantityKg}
               onChange={e=>setForm({...form, quantityKg:e.target.value})}
               className="border p-2"/>
        <input placeholder="Price per kg" value={form.pricePerKg}
               onChange={e=>setForm({...form, pricePerKg:e.target.value})}
               className="border p-2"/>
        <input placeholder="Location" value={form.location}
               onChange={e=>setForm({...form, location:e.target.value})}
               className="border p-2"/>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <table className="table-auto border w-full">
        <thead className="bg-gray-200">
          <tr><th>Name</th><th>Qty</th><th>Price/kg</th><th>Location</th></tr>
        </thead>
        <tbody>
          {crops.map(c=>(
            <tr key={c.id} className="border text-center">
              <td>{c.name}</td>
              <td>{c.quantityKg}</td>
              <td>{c.pricePerKg}</td>
              <td>{c.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ML Recommendation Section */}
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Crop Recommendation</h2>
        <div className="flex gap-2 flex-wrap">
          <input name="soilType" placeholder="Soil Type"
                 value={recForm.soilType}
                 onChange={e=>setRecForm({...recForm, soilType:e.target.value})}
                 className="border p-2"/>
          <input name="season" placeholder="Season"
                 value={recForm.season}
                 onChange={e=>setRecForm({...recForm, season:e.target.value})}
                 className="border p-2"/>
          <input name="rainfall" placeholder="Rainfall"
                 value={recForm.rainfall}
                 onChange={e=>setRecForm({...recForm, rainfall:e.target.value})}
                 className="border p-2"/>
          <button onClick={handleRecommend}
                  className="bg-blue-600 text-white px-4 py-2 rounded">
            Get Recommendation
          </button>
        </div>

        {recommendation && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <h3 className="font-semibold">Recommended Crop:</h3>
            <pre>{JSON.stringify(recommendation, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
