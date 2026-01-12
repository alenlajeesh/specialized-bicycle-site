import { useEffect, useState, useRef } from "react";
import "../styles/bikes.css";
import img1 from "../assets/bikeShopImages/img1.webp";
import img2 from "../assets/bikeShopImages/img2.webp";
import img3 from "../assets/bikeShopImages/img3.webp";
import img4 from "../assets/bikeShopImages/img4.webp";
import img5 from "../assets/bikeShopImages/img5.webp";
import img6 from "../assets/bikeShopImages/img6.webp";
import img7 from "../assets/bikeShopImages/img7.webp";


function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const categoryRef = useRef(null);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch bikes");
          return;
        }

        const bikeProducts = (data.products || []).filter(
          (p) => p.category.toLowerCase() === "bike"
        );

        setBikes(bikeProducts);
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

  /* ================= CATEGORY SCROLL ================= */

  const scrollLeft = () => {
    if (!categoryRef.current) return;
    categoryRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!categoryRef.current) return;
    categoryRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  if (loading) return <p className="bikes-loading">Loading bikes...</p>;
  if (error) return <p className="bikes-error">{error}</p>;

  const categories = [
    { name: "Electric Bikes", image: img1 },
    { name: "Mountain Bikes", image: img2 },
    { name: "Road Bikes", image: img3 },
    { name: "Gravel Bikes", image: img4 },
    { name: "City Bikes", image: img5 },
    { name: "Kids Bikes", image: img6 },
    {name: "Complete Your Ride With Accessories", image: img7},
  ];
  

  return (
    <div className="bikes-page">
      {/* ================= HEADER ================= */}
      <div className="bikes-header">
        <h1 className="bikes-title">
          Bikes <span>({bikes.length})</span>
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
            <input type="checkbox"  /> Mountain
          </label>
          <label>
            <input type="checkbox"  /> Road
          </label>
          <label>
            <input type="checkbox"  /> Gravel
          </label>
          <label>
            <input type="checkbox"  /> Electric
          </label>

          <h3>Price</h3>
          <label>
            <input type="checkbox"  /> Under ₹50,000
          </label>
          <label>
            <input type="checkbox"  /> ₹50,000+
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

              <button className="add-cart-btn" disabled={bike.stock === 0}>
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
