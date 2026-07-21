import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Seller.css";

const API = "http://localhost:3008";

function getToken() {
  let token = localStorage.getItem("sellerToken");
  if (!token) return null;
  return token.replace(/^"(.*)"$/, "$1");
}

const EMPTY_FORM = {
  brand: "",
  size: "",
  brandcountry: "",
  price: "",
  stock: "",
  color: "",
  about: "",
};

function SellerHome() {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadData = async () => {
    const token = getToken();
    if (!token) {
      setError("Token topilmadi! Iltimos, profilga qaytadan kiring.");
      setSeller(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Har safar eski ma'lumotni tozalab, so'ng qayta yuklaymiz.
      // Bu eski seller ma'lumoti bir zum ekranda "yopishib qolishi"ning oldini oladi.
      setSeller(null);
      setProducts([]);
      const [meRes, clothesRes] = await Promise.all([
        axios.get(`${API}/seller/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          params: { _t: Date.now() },
        }),
        axios.get(`${API}/seller/clothes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          params: { _t: Date.now() },
        }),
      ]);

      // Backend qaytargan response tuzilmasini moslash (data.data yoki data)
      const sellerData = meRes.data?.data || meRes.data;
      setSeller(sellerData);

      const clothesData = clothesRes.data?.data || clothesRes.data;
      setProducts(Array.isArray(clothesData) ? clothesData : []);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
      if (err.response?.status === 401) {
        // Token yaroqsiz yoki eski/soxta bo'lsa - uni tozalab, foydalanuvchini qayta login qilishga yo'naltiramiz.
        localStorage.removeItem("sellerToken");
        setSeller(null);
        setProducts([]);
        setError("Sessiya muddati tugadi. Iltimos, qaytadan tizimga kiring.");
      } else {
        setError("Profil ma'lumotlarini yuklab bo'lmadi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sotuvchi tizimdan chiqqanda tokenni va barcha state'larni to'liq tozalaymiz,
  // shunda keyingi kirgan seller oldingisining ma'lumotlarini aslo ko'rmaydi.
  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    setSeller(null);
    setProducts([]);
    setForm(EMPTY_FORM);
    setError(null);
    window.location.href = "/seller/login";
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
      return;
    }
    try {
      const token = getToken();
      await axios.delete(`${API}/seller/clothes/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      alert("O'chirishda xatolik yuz berdi.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClothes = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.brand || !form.size) {
      setFormError("Brend va o'lcham majburiy.");
      return;
    }

    try {
      setSubmitting(true);
      const token = getToken();
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : 0,
        stock: form.stock ? Number(form.stock) : 0,
      };

      const res = await axios.post(`${API}/seller/clothes`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const created = res.data?.data || res.data;
      setProducts((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Mahsulot qo'shishda xatolik:", err);
      setFormError(
        err.response?.data?.message || "Mahsulot qo'shib bo'lmadi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const statusKey = (seller?.status || "pending").toLowerCase();

  return (
    <div className="dashboard">
      {/* ---------- Sidebar ---------- */}
      <aside className="dash-sidebar">
        <div className="dash-logo">Lume</div>

        <nav className="dash-nav">
          <a className="dash-nav-link" href="#profile">
            Profil
          </a>
          <a className="dash-nav-link active" href="#products">
            Mahsulotlar
          </a>
          <a className="dash-nav-link" href="#add-product">
            Kiyim qo'shish
          </a>
        </nav>

        <div className="dash-sidebar-footer">
          <span className="dash-eyebrow">Sotuvchilik paneli</span>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Chiqish
          </button>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <main className="dash-main">
        {loading ? (
          <div className="dash-loading-inline">Ma'lumotlar yuklanmoqda...</div>
        ) : error ? (
          <div className="dash-error-inline">
            <p>{error}</p>
            <button className="btn-primary" onClick={loadData}>
              Qaytadan urinish
            </button>
          </div>
        ) : (
          <>
            {/* ===== 1. Seller profile ===== */}
            <section id="profile" className="dash-section">
              <header className="dash-header">
                <div>
                  <span className="dash-eyebrow">Xush kelibsiz</span>
                  <h1 className="dash-title">
                    {seller?.shopname ||
                      seller?.shop_name ||
                      seller?.brandname ||
                      seller?.brand_name ||
                      seller?.name ||
                      "Sotuvchi"}
                  </h1>
                </div>
                <span className={`status-badge ${statusKey}`}>
                  {statusKey === "approved" || statusKey === "active"
                    ? "Tasdiqlangan"
                    : "Kutilmoqda"}
                </span>
              </header>

              <dl className="dash-info-grid">
                <div className="dash-info-item">
                  <dt>F.I.SH / Ism</dt>
                  <dd>{seller?.name || seller?.fullName || "—"}</dd>
                </div>
                <div className="dash-info-item">
                  <dt>Email</dt>
                  <dd>{seller?.email || "—"}</dd>
                </div>
                <div className="dash-info-item">
                  <dt>Telefon</dt>
                  <dd>{seller?.phone || seller?.phoneNumber || "—"}</dd>
                </div>
                <div className="dash-info-item">
                  <dt>Do'kon nomi</dt>
                  <dd>
                    {seller?.shopname ||
                      seller?.shop_name ||
                      seller?.brandname ||
                      "—"}
                  </dd>
                </div>
              </dl>
            </section>

            {/* ===== 2. Products table ===== */}
            <section id="products" className="dash-section">
              <div className="section-heading">
                <h2 className="dash-card-title">Mahsulotlarim</h2>
                <span className="count-badge">
                  {String(products.length).padStart(2, "0")} ta mahsulot
                </span>
              </div>

              <table className="products-table">
                <colgroup>
                  <col style={{ width: "38%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "16%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Mahsulot</th>
                    <th>Holati</th>
                    <th>Sotilgan</th>
                    <th>Narx</th>
                    <th>Aksiyalar</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-cell">
                        Hozircha mahsulotlar mavjud emas.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id || product._id}>
                        <td>
                          <div className="product-details">
                            <div
                              className="product-color-box"
                              style={{
                                backgroundColor: product.color || "#ccc",
                              }}
                            />
                            <div className="product-text">
                              <span className="product-name">
                                {product.brand}
                              </span>
                              <span className="product-desc">
                                {product.about || product.brandcountry}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="status-badge approved">Faol</span>
                        </td>

                        <td className="sold-count">
                          {product.sold_count || 0} dona
                        </td>

                        <td className="product-price">
                          {(product.price || 0).toLocaleString("uz-UZ")} so'm
                        </td>

                        <td>
                          <div className="actions">
                            <button
                              type="button"
                              className="btn-danger btn-sm"
                              onClick={() =>
                                handleDelete(product.id || product._id)
                              }
                            >
                              O'chirish
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            {/* ===== 3. Add clothes form ===== */}
            <section id="add-product" className="dash-section">
              <h2 className="dash-card-title">Yangi kiyim qo'shish</h2>

              <form className="add-form" onSubmit={handleAddClothes}>
                <div className="add-form-grid">
                  <label className="field">
                    <span>Brend *</span>
                    <input
                      name="brand"
                      value={form.brand}
                      onChange={handleFormChange}
                      placeholder="masalan: Adidas"
                    />
                  </label>

                  <label className="field">
                    <span>O'lcham *</span>
                    <input
                      name="size"
                      value={form.size}
                      onChange={handleFormChange}
                      placeholder="masalan: M, 42"
                    />
                  </label>

                  <label className="field">
                    <span>Ishlab chiqarilgan davlat</span>
                    <input
                      name="brandcountry"
                      value={form.brandcountry}
                      onChange={handleFormChange}
                      placeholder="masalan: Turkiya"
                    />
                  </label>

                  <label className="field">
                    <span>Narx (so'm)</span>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </label>

                  <label className="field">
                    <span>Ombordagi soni</span>
                    <input
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </label>

                  <label className="field">
                    <span>Rang</span>
                    <input
                      name="color"
                      value={form.color}
                      onChange={handleFormChange}
                      placeholder="masalan: qora"
                    />
                  </label>

                  <label className="field field-wide">
                    <span>Tavsif</span>
                    <textarea
                      name="about"
                      value={form.about}
                      onChange={handleFormChange}
                      placeholder="Mahsulot haqida qisqacha"
                      rows={3}
                    />
                  </label>
                </div>

                {formError && <p className="form-error">{formError}</p>}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Qo'shilmoqda..." : "Mahsulot qo'shish"}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default SellerHome;