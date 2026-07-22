
import React, { useState } from 'react';
import './regsiter.css';
import { useNavigate } from 'react-router-dom';

// Backend manzili — .env orqali boshqarish tavsiya etiladi (masalan REACT_APP_API_URL)
const API_URL = 'https://online-clothes-shop.onrender.com';


// AuthPage funksiyasi ichida, eng birinchi qatorda
const AuthPage = () => {
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

    const endpoint = isLogin ? '/user/login' : '/user/register';
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

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      alert(isLogin ? 'Tizimga muvaffaqiyatli kirdingiz!' : 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz!');
      navigate('/');
    } catch (err) {
      console.error('Auth xatosi:', err);
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
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>

        <div className="blook-form-container">
          <h2 className="blook-title">{isLogin ? "Log in" : "Sign up"}</h2>

          {error && <p className="blook-error">{error}</p>}

          <form onSubmit={handleSubmit} className="blook-form">
            {!isLogin && (
              <div className="blook-input-wrapper">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full name" 
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
                placeholder="Username or email" 
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
              {loading ? "Yuklanmoqda..." : (isLogin ? "Let's go!" : "Create account")}
            </button>
          </form>

          <div className="blook-divider">
            <span>or</span>
          </div>

          <button className="blook-btn-google">
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/web-24dp/copy_of_googleg_standard_color_24dp.png" alt="Google" />
            Google
          </button>

          {isLogin && (
            <a href="#forgot" className="blook-forgot">Forgot your password?</a>
          )}
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
            Leveling up your style,<br /><span>one outfit at a time.</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;