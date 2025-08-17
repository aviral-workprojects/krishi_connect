import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../api"; // ✅ use centralized axios instance

// Socket.IO needs the raw backend host, not the `/api` path
const socket = io(
  (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api").replace(
    "/api",
    ""
  )
);

export default function Leaderboard() {
  const [farmers, setFarmers] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard"); // ✅ cleaner now
      setFarmers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err.message);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    socket.on("leaderboardUpdated", fetchLeaderboard);
    return () => socket.off("leaderboardUpdated", fetchLeaderboard);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>
      <table className="table-auto border w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Farmer</th>
            <th className="p-2">Sales (₹)</th>
          </tr>
        </thead>
        <tbody>
          {farmers.length > 0 ? (
            farmers.map((f, i) => (
              <tr key={i} className="border text-center">
                <td className="p-2">{f.name}</td>
                <td className="p-2">₹{f.totalSales}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center p-4 text-gray-500">
                No sales data yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
