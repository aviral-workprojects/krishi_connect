import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import Marketplace from './pages/Marketplace';
import CheckoutPage from './pages/CheckoutPage';
import Leaderboard from './pages/Leaderboard';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-4 bg-green-700 text-white flex justify-between">
        <Link to="/" className="font-bold">Kisan Bazaar</Link>
        <div>
          <button onClick={() => i18n.changeLanguage('en')} className="px-2">EN</button>
          <button onClick={() => i18n.changeLanguage('hi')} className="px-2">हिं</button>
          <button onClick={() => i18n.changeLanguage('gu')} className="px-2">ગુ</button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}
