import { useEffect, useState } from "react";
import "../styles/bikes.css";

function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/products");
        const data = await res.json();

        if (!res.ok) {
          setError("Failed to fetch bikes");
          return;
        }

        // backend returns { products: [...] }
        setBikes(data.products);
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  const addToCart = async (productId) => {
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/cart/add", {
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

      if (!res.ok) throw new Error("Failed to add to cart");

      alert("Added to cart 🛒");
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  if (loading) return <p className="bikes-loading">Loading bikes...</p>;
  if (error) return <p className="bikes-error">{error}</p>;

  return (
    <div className="bikes-containers">
      <h1>Available Bikes</h1>

      <div className="bikes-grid">
        {bikes.map((bike) => (
          <div key={bike._id} className="bike-card">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bikes;

