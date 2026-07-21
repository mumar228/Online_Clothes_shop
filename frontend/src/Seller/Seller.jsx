import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Seller.css";

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        setLoading(true);
        let token = localStorage.getItem("sellerToken");

        if (!token) {
          console.error("Token topilmadi! Iltimos, qaytadan kiring.");
          setLoading(false);
          return;
        }

        token = token.replace(/^"(.*)"$/, "$1");
        const response = await axios.get(
          "http://localhost:3008/seller/clothes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        
        const fetchedData = response.data.data || response.data;
        setProducts(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error("Mahsulotlarni yuklashda xatolik yuz berdi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
      try {
        let token = localStorage.getItem("sellerToken");
        if (token) {
          token = token.replace(/^"(.*)"$/, "$1"); // O'chirishda ham tokenni tozalaymiz
        }

        await axios.delete(
          `http://localhost:3008/seller/clothes/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setProducts(products.filter((p) => p.id !== productId));
      } catch (error) {
        alert("O'chirishda xatolik yuz berdi.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="title">Mahsulotlarim</h1>
        <span className="count">
          {String(products.length).padStart(2, "0")} ta mahsulot
        </span>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>MAHSULOT</th>
            <th>HOLATI</th>
            <th>SOTILGAN</th>
            <th>NARX</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                Hozircha mahsulotlar mavjud emas.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-details">
                    <div
                      className="product-color-box"
                      style={{ backgroundColor: product.color_hex || "#ccc" }}
                    />
                    <div className="product-text">
                      <span className="product-name">{product.name}</span>
                      <span className="product-desc">
                        {product.description}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    className={`status-badge ${(product.status || "active").toLowerCase().replace(" ", "-")}`}
                  >
                    {product.status || "Faol"}
                  </span>
                </td>

                <td className="sold-count">{product.sold_count || 0} dona</td>

                <td className="product-price">
                  {(product.price || 0).toLocaleString("uz-UZ")} so'm
                </td>

                <td>
                  <div className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => console.log("Edit ID:", product.id)}
                    >
                      Tahrirlash
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
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
    </div>
  );
}

export default SellerProducts;
``;
