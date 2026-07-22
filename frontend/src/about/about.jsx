import React from "react";
import "./about.css";
import { Link } from "react-router-dom";

/*
  LUME — Onlayn kiyim-kechak do'koni uchun "Biz haqimizda" sahifasi
  ClothingStore bilan bir xil dizayn tizimidan foydalanadi.
*/

const STATS = [
  { num: "50k+", label: "mamnun mijoz" },
  { num: "300+", label: "brendlar va modellar" },
  { num: "14", label: "shahar bo'ylab yetkazib berish" },
];

const PROCESS = [
  {
    num: "01",
    name: "Tanlang",
    desc: "Minglab model orasidan o'zingizga yoqqanini toping va o'lchamni belgilang.",
  },
  {
    num: "02",
    name: "Buyurtma bering",
    desc: "Bir necha bosim bilan buyurtmani rasmiylashtiring, to'lovni tanlang.",
  },
  {
    num: "03",
    name: "Yetkazib olamiz",
    desc: "Buyurtma 1–3 kun ichida ko'rsatgan manzilingizga yetkaziladi.",
  },
  {
    num: "04",
    name: "Kiying, bahramand bo'ling",
    desc: "Yoqmasa — 14 kun ichida bepul qaytarish yoki almashtirish mumkin.",
  },
];

const TEAM = [
  { name: "Dilnoza Yusupova", role: "Bosh stilist", bg: "#4B5842", initials: "DY" },
  { name: "Sardor Aliyev", role: "Marketing bo'limi", bg: "#A6552F", initials: "SA" },
  { name: "Nigora Karimova", role: "Mijozlar xizmati", bg: "#1C1B19", initials: "NK" },
];

export default function AboutPage() {
  return (
    <div className="atelier-about">
      <header className="about-header">
        <div className="about-logo">Lume</div>
          <nav className="lume-menu-wrapper">
            <ul className="lume-menu">
              <li>
                <Link to="/home" className="lume-menu-link">
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
        <div />
      </header>

      <section className="about-hero">
        <div className="about-eyebrow">Bizning tarix — 2021 yildan buyon</div>
        <h1 className="about-title">
          Har mavsum uchun <em>yangi</em> uslub
        </h1>
        <p className="about-lede">
          Lume — zamonaviy va qulay narxdagi kiyimlarni bir joyga jamlagan onlayn do'kon.
          Trenddagi kolleksiyalarni uydan chiqmasdan tanlang va buyurtma qiling.
        </p>
      </section>

      <section className="about-story">
        <div className="about-story-text">
          <p>
            2021-yilda kichik onlayn katalog sifatida boshlangan Lume bugungi kunda
            O'zbekiston bo'ylab minglab mijozlar tanlaydigan kiyim-kechak platformasiga
            aylandi. Har mavsumda yangi kolleksiyalar qo'shib boramiz.
          </p>
          <div className="about-quote">
            "Uslub — bu qimmat emas, to'g'ri tanlov" — bizning asosiy tamoyilimiz shu.
          </div>
          <p>
            Katalogimizdagi har bir model sifat va qulaylik bo'yicha tanlab olinadi.
            Tezkor yetkazib berish, oson to'lov va bepul qaytarish — barchasi bir joyda.
          </p>
        </div>
        <div className="about-story-panel">
          {STATS.map((s) => (
            <div className="about-stat" key={s.label}>
              <span className="about-stat-num">{s.num}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-head">
          <h2 className="about-section-title">Qanday xarid qilish</h2>
          <span className="about-section-note">Tanlashdan kiyishgacha</span>
        </div>
        <div className="process-grid">
          {PROCESS.map((p) => (
            <div className="process-step" key={p.num}>
              <span className="process-num">{p.num}</span>
              <span className="process-name">{p.name}</span>
              <span className="process-desc">{p.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-head">
          <h2 className="about-section-title">Bizning jamoa</h2>
          <span className="about-section-note">3 asosiy bo'lim</span>
        </div>
        <div className="team-grid">
          {TEAM.map((t) => (
            <div className="team-card" key={t.name}>
              <div className="team-avatar" style={{ background: t.bg }}>
                {t.initials}
              </div>
              <span className="team-name">{t.name}</span>
              <span className="team-role">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-head">
          <h2 className="about-section-title">Biz bilan bog'laning</h2>
        </div>
        <div className="visit-panel">
          <div className="visit-block">
            <div className="visit-label">Yetkazib berish</div>
            <div className="visit-value">O'zbekiston bo'ylab 14 shahar, 1–3 ish kunida</div>
          </div>
          <div className="visit-block">
            <div className="visit-label">Ish vaqti</div>
            <div className="visit-value">Har kuni, 09:00–21:00 (onlayn qo'llab-quvvatlash)</div>
          </div>
          <div className="visit-block">
            <div className="visit-label">Aloqa</div>
            <div className="visit-value">+998 90 123 45 67<br />hello@lume.uz</div>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <span className="about-footer-note">© 2026 LUME — O'zbekiston bo'ylab yetkazib beriladi</span>
        <div className="about-footer-links">
          <a href="#">Instagram</a>
          <a href="#">Telegram</a>
          <a href="#">Yetkazib berish</a>
        </div>
      </footer>
    </div>
  );
}