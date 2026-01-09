import { useEffect, useState } from "react";
import "../styles/bikes.css";

function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
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

        setBikes(data.products);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    // decode token to check if user is admin
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (err) {
        console.log("Invalid token", err);
      }
    }

    fetchBikes();
  }, [token]);

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

      if (!res.ok) throw new Error("Failed to add to cart");

      alert("Added to cart 🛒");
    } catch {
      alert("Error adding to cart");
    }
  };

  const deleteBike = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete bike");

      setBikes(bikes.filter((bike) => bike._id !== productId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="bikes-loading">Loading bikes...</p>;
  if (error) return <p className="bikes-error">{error}</p>;

  return (
    <div className="bikes-container">
      <h1>Available Bikes</h1>

      <div className="products-grid">
        {bikes.map((bike) => (
          <div key={bike._id} className="product-card">
            {/* ✅ BIKE IMAGE */}
            <img
              src={
                bike.imageUrl
                  ? `http://localhost:3000${bike.imageUrl}`
                  : "/placeholder-bike.png"
              }
              alt={bike.name}
              className="bike-image"
            />

            <h2>{bike.name}</h2>
            <p className="bike-desc">{bike.description}</p>

            <div className="bike-meta">
              <span>₹{bike.price}</span>
              <span>Stock: {bike.stock}</span>
            </div>

            <button
              className="add-cart-btn"
              onClick={() => addToCart(bike._id)}
            >
              Add to Cart
            </button>

            {user?.role === "admin" && (
              <button
                className="bike-delete"
                onClick={() => deleteBike(bike._id)}
              >
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

