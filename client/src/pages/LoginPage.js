import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'farmer') navigate('/farmer/dashboard');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-xl p-6 w-80">
        <h2 className="text-xl font-bold mb-4">{t('login')}</h2>
        <input type="email" placeholder="Email" className="border p-2 mb-2 w-full"
               value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border p-2 mb-2 w-full"
               value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">{t('login')}</button>
      </form>
    </div>
  );
}
