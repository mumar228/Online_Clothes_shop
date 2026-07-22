import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import axios from "axios"; 

const API = "http://localhost:3008";

export default function LumeLanding() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API}/clothes`) 
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Backenddan ma'lumot olishda xato:", err);
        setError("Ma'lumotlarni yuklab bo'lmadi");
        setLoading(false);
      });
  }, []);

  // SAVATGA QO'SHISH FUNKSIYASI
  const addToCart = (product) => {
    // Avval savatda bor mahsulotlarni localStorage'dan o'qiymiz
    const currentCart = JSON.parse(localStorage.getItem("lume-cart")) || [];
    
    // Mahsulot savatda allaqachon bormi tekshiramiz
    const isProductInCart = currentCart.some((item) => item.id === product.id);

    if (isProductInCart) {
      alert("Bu mahsulot savatga allaqachon qo'shilgan!");
      return;
    }

    // Yangi mahsulotni ro'yxatga qo'shamiz
    const updatedCart = [...currentCart, { ...product, quantity: 1 }];
    
    // LocalStorage'ga yozib qo'yamiz
    localStorage.setItem("lume-cart", JSON.stringify(updatedCart));
    alert("Mahsulot savatga muvaffaqiyatli qo'shildi!");
  };

  return (
    <div className="lume-page">
      {/* NAVIGATSIYA */}
      <header className="lume-header">
        <div className="lume-container lume-nav">
          <a href="#" className="lume-logo">Lume</a>
          <nav className="lume-menu-wrapper">
            <ul className="lume-menu">
              <li><Link to="/" className="lume-menu-link">Do'kon</Link></li>
              <li><Link to="/about" className="lume-menu-link">Biz haqimizda</Link></li>
              <li><Link to="/Savat" className="lume-menu-link">Savat</Link></li>
              <li><Link to="/SellerRegister" className="lume-menu-link">Sotuvchilik</Link></li>
              <li><Link to="/Profile" className="lume-menu-link">Profil</Link></li>
              <li><Link to="/register" className="lume-menu-link">Register</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="lume-hero">
        <div className="lume-container">
          <span className="lume-hero-sub">Bizning tarix — 2021 yildan buyon</span>
          <h1 className="lume-hero-title">Har mavsum uchun <em>yangi</em> uslub</h1>
          <p className="lume-hero-desc">
            Lume — zamonaviy va qulay narxdagi kiyimlarni bir joyga jamlagan onlayn do'kon.
          </p>
        </div>
      </section>

      {/* INFO VA STATISTIKA PANELI */}
      <section className="lume-info-section">
        <div className="lume-container">
          <div className="lume-info-grid">
            <div className="lume-info-left">
              <p>2021-yilda boshlangan Lume bugungi kunda O'zbekiston bo'ylab minglab mijozlar tanlaydigan platformaga aylandi.</p>
              <blockquote className="lume-quote">"Uslub — bu qimmat emas, to'g'ri tanlov"</blockquote>
            </div>
            <div className="lume-right" style={{ backgroundImage: "linear-gradient(#dcd4c4 1px, transparent 1px)", backgroundSize: "100% 30px" }}>
              <div className="lume-stat-item"><span className="lume-stat-num">50k+</span><span className="lume-stat-label">Mamnun mijoz</span></div>
              <div className="lume-stat-item"><span className="lume-stat-num">300+</span><span className="lume-stat-label">Eksklyuziv mahsulotlar</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SOTUV KATALOGI */}
      <section className="lume-catalog">
        <div className="lume-container">
          <div className="lume-catalog-header">
            <h2>Yangi kolleksiya</h2>
            <a href="#" className="lume-btn-all">Barchasini ko'rish</a>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Yuklanmoqda...</div>
          ) : error ? (
            <div style={{ color: "red", textAlign: "center", padding: "40px" }}>{error}</div>
          ) : (
            <div className="uzum-products-grid">
              {products.map((product) => {
                const monthlyPrice = Math.round((product.price * 1.15) / 12);
                const oldPrice = Math.round(product.price * 1.25);

                return (
                  <div key={product.id} className="uzum-card">
                    <div className="uzum-card-img-wrapper">
                      {product.image ? (
                        <img
                          src={`${API}${product.image}`}
                          alt={product.brand}
                          className="uzum-card-img"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div className="uzum-card-img-placeholder">
                          <span className="original-badge">✔️ ORIGINAL</span>
                        </div>
                      )}
                    </div>

                    <div className="uzum-card-info">
                      <div className="uzum-card-price-block">
                        <span className="uzum-card-current-price">
                          {Number(product.price).toLocaleString("fr-FR")} so'm
                        </span>
                        <span className="uzum-card-old-price">
                          {Number(oldPrice).toLocaleString("fr-FR")} so'm
                        </span>
                      </div>

                      <div className="uzum-card-installment">
                        {Number(monthlyPrice).toLocaleString("fr-FR")} so'm/oyiga
                      </div>

                      <h3 className="uzum-card-title">
                        <strong>{product.brand}</strong> — {product.about || "Sifatli kiyim"}
                      </h3>

                      <div className="uzum-card-rating">
                        <span className="star-icon">⭐ 4.9</span>
                        <span className="reviews-count">({product.brandcountry || "O'zbekiston"})</span>
                      </div>

                      {/* CHANGED: onClick hodisasi biriktirildi */}
                      <button className="uzum-card-btn" onClick={() => addToCart(product)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        Ertaga olish
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}