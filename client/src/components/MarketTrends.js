import React, { useEffect, useState } from "react";
import api from "../api";

export default function MarketTrends() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await api.get("/api/ml/trends");
        setTrends(response.data);
      } catch (err) {
        setError("Failed to load market trends");
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">📊 Market Trends</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {trends && (
        <div className="space-y-2">
          {Array.isArray(trends) ? (
            <ul className="list-disc pl-5">
              {trends.map((trend, idx) => (
                <li key={idx}>
                  <strong>{trend.crop}:</strong> {trend.prediction}
                </li>
              ))}
            </ul>
          ) : (
            <pre className="text-sm">{JSON.stringify(trends, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
