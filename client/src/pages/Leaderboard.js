import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(process.env.REACT_APP_API_BASE_URL.replace('/api','')); 
// backend should emit events on order success (not coded earlier, but stub)

export default function Leaderboard() {
  const [farmers, setFarmers] = useState([]);

  const fetchLeaderboard = async () => {
    // For now, fetch via API (e.g. top sellers). You’d implement /api/leaderboard in backend.
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/leaderboard`);
      setFarmers(res.data);
    } catch { /* ignore */ }
  };

  useEffect(()=>{
    fetchLeaderboard();
    socket.on('leaderboardUpdated', fetchLeaderboard);
    return ()=>socket.off('leaderboardUpdated');
  },[]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="table-auto border w-full">
        <thead className="bg-gray-200"><tr><th>Farmer</th><th>Sales (₹)</th></tr></thead>
        <tbody>
          {farmers.map((f,i)=>(
            <tr key={i} className="border text-center">
              <td>{f.name}</td>
              <td>₹{f.totalSales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
