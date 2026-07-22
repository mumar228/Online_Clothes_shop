import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom'; // Kabinetga avtomatik o'tish uchun
import './SellerRegister.css';

const SellerRegister = () => {
  const navigate = useNavigate();
  
  // TypeORM sxemangizga to'liq mos keladigan boshlang'ich holat
  const [formData, setFormData] = useState({
    name: '',
    brandname: '',
    shopname: '',
    phone: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://online-clothes-shop.onrender.com/seller/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Roʻyxatdan oʻtishda xatolik yuz berdi');
      }

      // Backend token'ni qaysi maydonda qaytarsa, o'sha yerdan olamiz.
      // Ko'p hollarda data.token, data.data.token yoki data.sellerToken bo'ladi.
      const token = data.data?.token || data.token || data.sellerToken;

      if (!token) {
        throw new Error('Server tokenni qaytarmadi. Backend javobini tekshiring.');
      }

      localStorage.setItem('sellerToken', token);

      alert("Tabriklaymiz! Do'koningiz muvaffaqiyatli ro'yxatdan o'tdi.");
      
      navigate('/Seller'); 

    } catch (error) {
      alert(`Xatolik: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lume-seller-container">
      
      {/* CHAP TOMON: Forma qismi */}
      <div className="seller-left-side">
        <div className="left-header">
          <div className="lume-brand-badge">Lume</div>
          <span className="seller-indicator">Sotuvchi rejimi</span>
        </div>

        <div className="seller-form-box">
          <h2 className="seller-heading">Hisob yaratish</h2>
          <p className="seller-subheading">Do'koningizni ro'yxatdan o'tkazish uchun ma'lumotlarni kiriting</p>
          
          <form onSubmit={handleSubmit} className="lume-actual-form">
            <div className="lume-input-wrapper">
              <input 
                type="text" 
                name="name"
                placeholder="Ismingiz"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="lume-input-wrapper">
              <input 
                type="text" 
                name="brandname"
                placeholder="Brend nomi (Masalan: Kiyin)"
                value={formData.brandname}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="lume-input-wrapper">
              <input 
                type="text" 
                name="shopname"
                placeholder="Do'kon nomi (Masalan: kiyin-bazar)"
                value={formData.shopname}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="lume-input-wrapper">
              <input 
                type="tel" 
                name="phone"
                placeholder="Telefon raqamingiz"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="lume-input-wrapper">
              <input 
                type="email" 
                name="email"
                placeholder="Email manzili"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="lume-input-wrapper">
              <input 
                type="password" 
                name="password"
                placeholder="Parol yarating"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* So'rov ketayotganda tugma matni o'zgaradi va yuklanish holati bo'ladi */}
            <button type="submit" className="lets-go-btn" disabled={loading}>
              {loading ? "Yuborilmoqda..." : "Davom etish"}
            </button>
          </form>

          <p className="seller-policy-footer">
            <br />
            <Link to="/SellerLogin">Siz royhatdan otinggizmi</Link>
          </p>
        </div>
      </div>

      {/* O'NG TOMON: Nuqtali to'q fon */}
      <div className="seller-right-side">
        <div className="right-side-content">
          <div className="large-l-logo">L</div>
          <h1 className="right-side-text">
            Biznesingizni kengaytiring, <br />
            <span className="accent-text">minglab xaridorlarga chiqing.</span>
          </h1>
        </div>
      </div>

    </div>
  );
};

export default SellerRegister;