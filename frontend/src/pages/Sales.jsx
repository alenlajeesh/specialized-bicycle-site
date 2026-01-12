import { useEffect, useState, useRef } from "react";
import "../styles/bikes.css";
import img1 from "../assets/gearShopImages/img1.webp";
import img2 from "../assets/gearShopImages/img2.webp";
import img3 from "../assets/gearShopImages/img3.webp";
import img4 from "../assets/gearShopImages/img4.webp";
import img5 from "../assets/gearShopImages/img5.webp";

function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const categoryRef = useRef(null);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch products");
          return;
        }

        setBikes(data.products || []);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {}
    }

    fetchBikes();
  }, [token, BASE_URL]);

  /* ================= ADD TO CART ================= */
  const addToCart = async (productId) => {
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      alert("Added to cart 🛒");
    } catch (err) {
      alert(err.message || "Error adding to cart");
    }
  };

  /* ================= CATEGORY SCROLL ================= */
  const scrollLeft = () => {
    if (!categoryRef.current) return;
    categoryRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!categoryRef.current) return;
    categoryRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) return <p className="bikes-loading">Loading products...</p>;
  if (error) return <p className="bikes-error">{error}</p>;

  /* ================= CATEGORY DATA ================= */
  const categories = [
    { name: "Electric", image: img1 },
    { name: "Bikes", image: img2 },
    { name: "Apparel", image: img3 },
    { name: "Helmets", image: img4 },
    { name: "Shoes", image: img5 },
  ];

  return (
    <div className="bikes-page">
      {/* ================= HEADER ================= */}
      <div className="bikes-header">
        <h1 className="bikes-title">
          Sales <span>({bikes.length})</span>
        </h1>
      </div>

      {/* ================= CATEGORY BAR ================= */}
      <div className="category-section">
        <button className="category-scroll-btn left" onClick={scrollLeft}>
          ←
        </button>

        <div className="category-row" ref={categoryRef}>
          {categories.map((cat) => (
            <div key={cat.name} className="category-card">
              <div className="category-image">
                <img src={cat.image} alt={cat.name} />
              </div>
              <p>{cat.name}</p>
            </div>
          ))}
        </div>

        <button className="category-scroll-btn right" onClick={scrollRight}>
          →
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="bikes-content">
        {/* Filters Sidebar */}
        <aside className="bikes-filters">
          <h3>Category</h3>
          <label>
            <input type="checkbox" /> Mountain
          </label>
          <label>
            <input type="checkbox" /> Road
          </label>
          <label>
            <input type="checkbox" /> Gravel
          </label>
          <label>
            <input type="checkbox" /> Electric
          </label>

          <h3>Price</h3>
          <label>
            <input type="checkbox" /> Under ₹50,000
          </label>
          <label>
            <input type="checkbox" /> ₹50,000+
          </label>
        </aside>

        {/* Products Grid */}
        <div className="products-grid">
          {bikes.map((bike) => (
            <div key={bike._id} className="product-card">
              <div className="image-wrapper">
                <img src={`${BASE_URL}${bike.imageUrl}`} alt={bike.name} />
              </div>

              <h2 className="bike-name">{bike.name}</h2>
              <p className="bike-desc">{bike.description}</p>

              <div className="bike-details">
                <span>
                  <strong>Color:</strong> {bike.color || "—"}
                </span>
                <span>
                  <strong>Size:</strong> {bike.size || "—"}
                </span>
                <span>
                  <strong>Category:</strong> {bike.category}
                </span>
              </div>

              <div className="bike-meta">
                <span className="price">₹{bike.price}</span>
                <span className={bike.stock > 0 ? "in-stock" : "out-stock"}>
                  {bike.stock > 0 ? `In Stock (${bike.stock})` : "Out of Stock"}
                </span>
              </div>

              <button
                className="add-cart-btn"
                onClick={() => addToCart(bike._id)}
                disabled={bike.stock === 0}
              >
                Add to Cart
              </button>

              {user?.role === "admin" && (
                <button className="delete-btn">Delete</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bikes;
