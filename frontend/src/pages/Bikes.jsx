import { useEffect, useState } from "react";
import "../styles/bikes.css";

function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/products`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch bikes");
          return;
        }

        // Only keep products with category "bike"
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
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) throw new Error();
      alert("Added to cart 🛒");
    } catch {
      alert("Error adding to cart");
    }
  };

  const deleteBike = async (productId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();
      setBikes((prev) => prev.filter((b) => b._id !== productId));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p className="bikes-loading">Loading bikes...</p>;
  if (error) return <p className="bikes-error">{error}</p>;

  return (
    <div className="bikes-page">
      <h1 className="bikes-title">Bikes</h1>

      <div className="products-grid">
        {bikes.map((bike) => (
          <div key={bike._id} className="product-card">
            <div className="image-wrapper">
              <img src={`${BASE_URL}${bike.imageUrl}`} alt={bike.name} />
            </div>

            <h2 className="bike-name">{bike.name}</h2>
            <p className="bike-desc"></p>

            <div className="bike-details">
              <span><strong>Color:</strong> {bike.color || "—"}</span><br/>
              <span><strong>Size:</strong> {bike.size || "—"}</span><br/>
              <span><strong>Category:</strong> {bike.category}</span><br/>
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
              <button className="delete-btn" onClick={() => deleteBike(bike._id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bikes;

