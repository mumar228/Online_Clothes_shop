import { useState, useEffect } from 'react';
import './Profile.css';
import { Link } from 'react-router-dom';
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

// Backenddan kelgan "name"ni ism va familiyaga ajratib beruvchi yordamchi funksiya
function splitName(fullName = '') {
  const parts = fullName.trim().split(' ');
  return {
    firstName: parts[0] || 'Foydalanuvchi',
    lastName: parts.slice(1).join(' ') || '',
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Tizimga kirmagansiz');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('https://online-clothes-shop.onrender.com/user/getme', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        }

        const data = await res.json();
        const { firstName, lastName } = splitName(data.name);

        setUser({
          firstName,
          lastName,
          email: data.email,
          phone: data.phone || 'Kiritilmagan',
          memberSince: data.createdAt ? new Date(data.createdAt).getFullYear() : '—',
          orderCount: data.orderCount ?? 0,
          favoriteCount: data.favoriteCount ?? 0,
          address: data.address || 'Manzil kiritilmagan',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="lume-root">
        <p style={{ padding: '40px', textAlign: 'center' }}>Yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="lume-root">
        <p style={{ padding: '40px', textAlign: 'center' }}>
          {error || 'Foydalanuvchi topilmadi'}
        </p>
      </div>
    );
  }

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