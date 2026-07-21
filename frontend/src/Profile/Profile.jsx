import { useState } from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';

const ORDERS = [
  {
    id: '#2481',
    name: 'Long Wool Coat',
    date: '3-iyul, 2026',
    price: '890 000 so\'m',
    status: 'done',
    swatch: '#4a5a3f',
  },
  {
    id: '#2469',
    name: 'Structured Blazer',
    date: '28-iyun, 2026',
    price: '620 000 so\'m',
    status: 'transit',
    swatch: '#d9cdb5',
  },
  {
    id: '#2440',
    name: 'Silk Shirt',
    date: '14-iyun, 2026',
    price: '960 000 so\'m',
    status: 'done',
    swatch: '#24231f',
  },
];

function Switch({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className={`switch ${on ? 'on' : ''}`}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onClick={() => setOn(!on)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOn(!on)}
    />
  );
}

export default function ProfilePage({ user = {
  firstName: 'Malika',
  lastName: 'Yusupova',
  email: 'malika.yusupova@gmail.com',
  phone: '+998 90 123 45 67',
  memberSince: 2022,
  orderCount: 12,
  favoriteCount: 7,
  address: "Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi, 12-uy",
} }) {
  return (
    <div className="lume-root">
      <nav className="lume-nav">
        <div className="lume-logo">Lume</div>
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
        <div className="cart-pill">
          Savat <span className="cart-badge">4</span>
        </div>
      </nav>

      <div className="lume-hero">
        <div className="eyebrow">HISOBINGIZ</div>
        <h1 className="serif">Profil</h1>
      </div>

      <div className="lume-body">
        <aside className="lume-sidebar">
          <div className="avatar">{user.firstName.charAt(0)}</div>
          <p className="side-name">{user.firstName} {user.lastName}</p>
          <p className="side-email">{user.email}</p>
          <div className="edit-link">Rasmni o'zgartirish</div>
          <div className="side-stats">
            <div>
              <p className="stat-num">{user.orderCount}</p>
              <div className="stat-label">Buyurtma</div>
            </div>
            <div>
              <p className="stat-num">{user.favoriteCount}</p>
              <div className="stat-label">Sevimli</div>
            </div>
            <div>
              <p className="stat-num">{user.memberSince}</p>
              <div className="stat-label">A'zo bo'lgan</div>
            </div>
          </div>
        </aside>

        <main className="lume-main">
          <section className="section">
            <h2>Shaxsiy ma'lumotlar</h2>
            <div className="form-grid">
              <div className="field">
                <label>Ism</label>
                <input type="text" defaultValue={user.firstName} />
              </div>
              <div className="field">
                <label>Familiya</label>
                <input type="text" defaultValue={user.lastName} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" defaultValue={user.email} />
              </div>
              <div className="field">
                <label>Telefon</label>
                <input type="tel" defaultValue={user.phone} />
              </div>
            </div>
            <button className="save-btn">O'zgarishlarni saqlash</button>
          </section>

          <section className="section">
            <h2>Yetkazib berish manzili</h2>
            <div className="addr-card">
              <div>
                <span className="addr-tag">Asosiy</span>
                <p className="addr-text">{user.address}</p>
              </div>
              <span className="addr-edit">Tahrirlash</span>
            </div>
          </section>

          <section className="section">
            <h2>So'nggi buyurtmalar</h2>
            {ORDERS.map((order) => (
              <div className="order-row" key={order.id}>
                <div className="swatch" style={{ background: order.swatch }} />
                <div className="order-info">
                  <h3>{order.name}</h3>
                  <div className="order-meta">Buyurtma {order.id} &middot; {order.date}</div>
                </div>
                <span className={`order-status ${order.status === 'done' ? 'status-done' : 'status-transit'}`}>
                  {order.status === 'done' ? 'Yetkazildi' : "Yo'lda"}
                </span>
                <div className="order-price">{order.price}</div>
              </div>
            ))}
          </section>

          <section className="section">
            <h2>Sozlamalar</h2>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Email orqali bildirishnomalar</div>
                <div className="toggle-sub">Buyurtma holati va aksiyalar haqida xabar olish</div>
              </div>
              <Switch defaultOn />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">SMS bildirishnomalar</div>
                <div className="toggle-sub">Yetkazib berish holati haqida SMS</div>
              </div>
              <Switch />
            </div>
            <div className="danger-link">Hisobni o'chirish</div>
          </section>
        </main>
      </div>
    </div>
  );
}