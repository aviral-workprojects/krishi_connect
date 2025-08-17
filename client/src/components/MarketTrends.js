import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function MarketTrends() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await axios.get("/api/ml/trends");
        setTrends(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load trends");
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-green-700">📊 Market Trends</h2>

      {loading && <p>Loading trends...</p>}
      {error && <p className="text-red-600">❌ {error}</p>}

      {!loading && !error && trends.length > 0 && (
        <>
          {/* Table view */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-green-100">
                {Object.keys(trends[0]).map((col) => (
                  <th key={col} className="border border-gray-300 px-3 py-2 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trends.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="border border-gray-300 px-3 py-2">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Chart view */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y_true" stroke="#8884d8" name="Actual Price" />
              <Line type="monotone" dataKey="y_pred" stroke="#82ca9d" name="Predicted Price" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
