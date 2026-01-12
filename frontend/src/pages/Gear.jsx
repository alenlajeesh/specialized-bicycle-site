import { useEffect, useState } from "react";
import "../styles/bikes.css"; // reuse the same CSS

function Gear() {
  const [gear, setGear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchGear = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/products`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch gear");
          return;
        }

        // Only keep products with category "gear"
        const gearProducts = (data.products || []).filter(
          (p) => p.category.toLowerCase() === "gear"
        );

        setGear(gearProducts);
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

    fetchGear();
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

  const deleteGear = async (productId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();
      setGear((prev) => prev.filter((g) => g._id !== productId));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p className="bikes-loading">Loading gear...</p>;
  if (error) return <p className="bikes-error">{error}</p>;

  return (
    <div className="bikes-page">
      <h1 className="bikes-title">Gear</h1>

      <div className="products-grid">
        {gear.map((item) => (
          <div key={item._id} className="product-card">
            <div className="image-wrapper">
              <img src={`${BASE_URL}${item.imageUrl}`} alt={item.name} />
            </div>

            <h2 className="bike-name">{item.name}</h2>
            <p className="bike-desc">{item.description}</p>

            <div className="bike-details">
              <span><strong>Color:</strong> {item.color || "—"}</span>
              <span><strong>Size:</strong> {item.size || "—"}</span>
              <span><strong>Category:</strong> {item.category}</span>
            </div>

            <div className="bike-meta">
              <span className="price">₹{item.price}</span>
              <span className={item.stock > 0 ? "in-stock" : "out-stock"}>
                {item.stock > 0 ? `In Stock (${item.stock})` : "Out of Stock"}
              </span>
            </div>

            <button
              className="add-cart-btn"
              onClick={() => addToCart(item._id)}
              disabled={item.stock === 0}
            >
              Add to Cart
            </button>

            {user?.role === "admin" && (
              <button className="delete-btn" onClick={() => deleteGear(item._id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gear;

