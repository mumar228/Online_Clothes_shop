import React, { useState } from 'react';
import './sellerlogin.css';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3008';

const SellerLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/seller/login' : '/seller/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Xatolik yuz berdi');
      }

      // Backend token'ni qaysi maydonda qaytarsa, o'sha yerdan olamiz.
      // Ko'p hollarda data.token yoki data.sellerToken bo'ladi.
      const token = data.data?.token || data.token || data.sellerToken;

      if (!token) {
        throw new Error('Server tokenni qaytarmadi. Backend javobini tekshiring.');
      }

      localStorage.setItem('sellerToken', token);

      alert(isLogin ? 'Tizimga muvaffaqiyatli kirdingiz!' : 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz!');
      navigate('/seller');
    } catch (err) {
      console.error('Seller auth xatosi:', err);
      setError(err.message || 'Server bilan bog\'lanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blook-layout">
      <div className="blook-left">
        <div className="blook-header">
          <a href="/" className="blook-logo">Lume</a>
          <button className="blook-toggle-top" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Ro'yxatdan o'tish" : 'Log in'}
          </button>
        </div>

        <div className="blook-form-container">
          <h2 className="blook-title">
            {isLogin ? 'Sotuvchi kabinetiga kirish' : "Sotuvchi sifatida ro'yxatdan o'tish"}
          </h2>

          {error && <p className="blook-error">{error}</p>}

          <form onSubmit={handleSubmit} className="blook-form">

            {!isLogin && (
              <div className="blook-input-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder="Ism"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="blook-input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="blook-input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="blook-btn-submit" disabled={loading}>
              {loading ? "Yuklanmoqda..." : (isLogin ? "Kirish" : "Ro'yxatdan o'tish")}
            </button>
          </form>
          <Link to="/SellerRegister" className="blook-forgot">
            Regsiteratsiyadan otmadingizmi
          </Link>
        
        </div>
      </div>

      <div className="blook-right">
        <div className="blook-right-content">
          <div className="wardrobe-spin-container">
            <div className="wardrobe-mascot">
              <div className="mascot-side side-1">L</div>
              <div className="mascot-side side-2">U</div>
              <div className="mascot-side side-3">M</div>
              <div className="mascot-side side-4">E</div>
            </div>
            <div className="wardrobe-shadow"></div>
          </div>

          <h3 className="blook-right-text">
            Do'koningizni boshqaring,<br /><span>bir joydan turib.</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;