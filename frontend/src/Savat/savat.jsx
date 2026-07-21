import React, { useState, useEffect } from "react";
import "./savat.css";
import { Link } from "react-router-dom";

/*
  LUME — Savat (Cart) sahifasi
  Onlayn kiyim-kechak do'koni uchun, tikuvchilik mavzusidagi matnlarsiz.
*/

const DELIVERY_FEE = 25000;

function formatSom(n) {
  return n.toLocaleString("uz-UZ").replace(/,/g, " ") + " so'm";
}

export default function CartPage() {
  // Statik INITIAL_ITEMS o'rniga boshlang'ich holatni localStorage'dan o'qiymiz
  const [items, setItems] = useState(() => {
    const savedCart = localStorage.getItem("lume-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [promo, setPromo] = useState("");

  // Har safar savatdagi mahsulotlar o'zgarganda localStorage'ni yangilab boramiz
  useEffect(() => {
    localStorage.setItem("lume-cart", JSON.stringify(items));
  }, [items]);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) + delta) } : it
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Narxlar hisob-kitobida product.price ishlatiladi (Postgres bazangizdan kelgan nom)
  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) * (it.qty || 1)), 0);
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;
  const itemCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  return (
    <div className="atelier-cart">
      <header className="cart-header">
        <div className="cart-logo">Lume</div>
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
        <div className="cart-header-count">
          Savat <span>{itemCount}</span>
        </div>
      </header>

      <div className="cart-title-bar">
        <div className="cart-eyebrow">Buyurtmangiz</div>
        <h1 className="cart-title">Savat</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-title">Savatingiz bo'sh</div>
              <div className="cart-empty-sub">
                Do'konga qaytib, o'zingizga yoqqan modellarni tanlang.
              </div>
              <button className="checkout-btn" onClick={() => (window.location.href = "/")}>
                Do'konga qaytish
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                {/* Rasm/swatch o'rniga rang berilgan bo'lsa ko'rinadi, bo'lmasa standart fon turadi */}
                <div className="cart-item-swatch" style={{ background: item.swatch || "#e5dec9" }} />
                <div className="cart-item-info">
                  {/* Postgres bazangizdagi 'brand' va 'about' ustunlarini kodingiz strukturasiga moslab chiqardik */}
                  <span className="cart-item-name">{item.brand || item.name}</span>
                  <span className="cart-item-meta">{item.about || "Lume eksklyuziv modeli"}</span>
                  <button className="cart-item-remove" onClick={() => removeItem(item.id)}>
                    O'chirish
                  </button>
                </div>
                <div className="cart-item-right">
                  <span className="cart-item-price">{formatSom(Number(item.price) * (item.qty || 1))}</span>
                  <div className="qty-stepper">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>
                      –
                    </button>
                    <span className="qty-value">{item.qty || 1}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary-title">Buyurtma xulosasi</h2>

          <div className="cart-summary-row">
            <span>Mahsulotlar ({itemCount})</span>
            <span>{formatSom(subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Yetkazib berish</span>
            <span>{items.length > 0 ? formatSom(delivery) : "—"}</span>
          </div>
          <div className="cart-summary-row total">
            <span>Jami</span>
            <span>{formatSom(total)}</span>
          </div>

          <div className="promo-row">
            <input
              className="promo-input"
              placeholder="Promokod"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button className="promo-btn">Qo'llash</button>
          </div>

          <button className="checkout-btn" disabled={items.length === 0}>
            Buyurtmani rasmiylashtirish
          </button>

          <p className="cart-note">
            Buyurtma 1–3 ish kunida yetkaziladi. Yoqmasa, 14 kun ichida bepul qaytarish
            mumkin.
          </p>
        </div>
      </div>

      <footer className="cart-footer">
        <span className="cart-footer-note">© 2026 LUME — O'zbekiston bo'ylab yetkazib beriladi</span>
        <div className="cart-footer-links">
          <a href="#">Instagram</a>
          <a href="#">Telegram</a>
          <a href="#">Yetkazib berish</a>
        </div>
      </footer>
    </div>
  );
}