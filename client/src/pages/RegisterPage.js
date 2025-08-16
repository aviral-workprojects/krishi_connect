import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'buyer' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'farmer') navigate('/farmer/dashboard');
      else navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Register failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{t('register')}</h2>
        <input type="text" placeholder="Name" className="border p-2 mb-2 w-full"
               value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
        <input type="email" placeholder="Email" className="border p-2 mb-2 w-full"
               value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        <input type="password" placeholder="Password" className="border p-2 mb-2 w-full"
               value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
        <select className="border p-2 mb-2 w-full"
                value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
          <option value="buyer">Buyer</option>
          <option value="farmer">Farmer</option>
        </select>
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">{t('register')}</button>
      </form>
    </div>
  );
}
