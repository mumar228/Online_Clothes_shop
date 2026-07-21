import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import AboutPage from "../about/about.jsx";
import SellerPage from "../Seller/Seller.jsx";
import SavatPage from "../Savat/savat.jsx";
import ProfilsePage from "../Profile/Profile.jsx";

export default function LumeLanding() {
  const products = [
    { id: 1, title: "Klassik Kola Nimcha", price: "349,000 UZS" },
    { id: 2, title: "Yozgi Zig'ir Ko'ylak", price: "420,000 UZS" },
    { id: 3, title: "Minimalist Shim", price: "289,000 UZS" },
  ];

  return (
    <div className="lume-page">
      {/* NAVIGATSIYA */}
      <header className="lume-header">
        <div className="lume-container lume-nav">
          <a href="#" className="lume-logo">
            Lume
          </a>
          <nav className="lume-menu-wrapper">
            <ul className="lume-menu">
              <li>
                <Link to="/" className="lume-menu-link">
                  Do'kon
                </Link>
              </li>
              <li>
                <Link to="/about" className="lume-menu-link">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link to="/Savat" className="lume-menu-link">
                  Savat
                </Link>
              </li>
              <li>
                <Link to="/SellerRegister" className="lume-menu-link">
                  Sotuvchilik
                </Link>
              </li>
              <li>
                <Link to="/Profile" className="lume-menu-link">
                  Profil
                </Link>
              </li>
            </ul>
          </nav>
          <li>
            <Link to="/register" className="lume-menu-link">
              regsiter
            </Link>
          </li>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="lume-hero">
        <div className="lume-container">
          <span className="lume-hero-sub">
            Bizning tarix — 2021 yildan buyon
          </span>
          <h1 className="lume-hero-title">
            Har mavsum uchun <em>yangi</em> uslub
          </h1>
          <p className="lume-hero-desc">
            Lume — zamonaviy va qulay narxdagi kiyimlarni bir joyga jamlagan
            onlayn do'kon. Trenddagi kolleksiyalarni uydan chiqmasdan tanlang va
            buyurtma qiling.
          </p>
        </div>
      </section>

      {/* INFO VA STATISTIKA PANELI */}
      <section className="lume-info-section">
        <div className="lume-container">
          <div className="lume-info-grid">
            {/* Chap tomon */}
            <div className="lume-info-left">
              <p>
                2021-yilda kichik onlayn katalog sifatida boshlangan Lume
                bugungi kunda O'zbekiston bo'ylab minglab mijozlar tanlaydigan
                kiyim-kechak platformasiga aylandi. Har mavsumda yangi
                kolleksiyalar qo'shib boramiz.
              </p>
              <blockquote className="lume-quote">
                "Uslub — bu qimmat emas, to'g'ri tanlov" — bizning asosiy
                shiorimiz.
              </blockquote>
            </div>

            {/* O'ng tomon (Chiziqli daftar effekti bilan) */}
            <div
              className="lume-info-right"
              style={{
                backgroundImage:
                  "linear-gradient(#dcd4c4 1px, transparent 1px)",
                backgroundSize: "100% 30px",
              }}
            >
              <div className="lume-stat-item">
                <span className="lume-stat-num">50k+</span>
                <span className="lume-stat-label">Mamnun mijoz</span>
              </div>
              <div className="lume-stat-item">
                <span className="lume-stat-num">300+</span>
                <span className="lume-stat-label">Eksklyuziv mahsulotlar</span>
              </div>
              <div className="lume-stat-item">
                <span className="lume-stat-num">100%</span>
                <span className="lume-stat-label">Sifat kafolati</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOTUV KATALOGI */}
      <section className="lume-catalog">
        <div className="lume-container">
          <div className="lume-catalog-header">
            <h2>Yangi kolleksiya</h2>
            <a href="#" className="lume-btn-all">
              Barchasini ko'rish
            </a>
          </div>

          <div className="lume-products-grid">
            {products.map((product) => (
              <a href="#" key={product.id} className="lume-product-card">
                <div className="lume-product-img" />
                <div className="lume-product-footer">
                  <h3 className="lume-product-title">{product.title}</h3>
                  <span className="lume-product-price">{product.price}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
