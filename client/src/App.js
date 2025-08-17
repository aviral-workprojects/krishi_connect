import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FarmerDashboard from "./pages/FarmerDashboard";
import Marketplace from "./pages/Marketplace";
import CheckoutPage from "./pages/CheckoutPage";
import Leaderboard from "./pages/Leaderboard";

// Components
import CropRecommendationForm from "./components/CropRecommendationForm";
import MarketTrends from "./components/MarketTrends";

export default function App() {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="p-4 bg-green-700 text-white flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          🌾 Kisan Bazaar
        </Link>

        {/* Main Nav Links */}
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            🛒 Marketplace
          </Link>
          <Link to="/recommend" className="hover:underline">
            🌱 Crop Recommendation
          </Link>
          <Link to="/trends" className="hover:underline">
            📊 Market Trends
          </Link>
          <Link to="/leaderboard" className="hover:underline">
            🏆 Leaderboard
          </Link>
        </div>

        {/* Language Switch */}
        <div className="space-x-2">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-2 hover:underline"
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage("hi")}
            className="px-2 hover:underline"
          >
            हिं
          </button>
          <button
            onClick={() => i18n.changeLanguage("gu")}
            className="px-2 hover:underline"
          >
            ગુ
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/recommend" element={<CropRecommendationForm />} />
          <Route path="/trends" element={<MarketTrends />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-3 text-sm">
        © {new Date().getFullYear()} Kisan Bazaar Direct
      </footer>
    </div>
  );
}
