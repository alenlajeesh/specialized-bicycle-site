import { useEffect, useState, useCallback } from "react";
import "../styles/cart.css";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /**
   * SAFE cart fetch
   * - Handles 500
   * - Handles empty cart
   * - Never crashes UI
   */
  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Backend broken or cart missing → treat as empty cart
      if (!res.ok) {
        setCart({ items: [] });
        setTotal(0);
        return;
      }

      const data = await res.json();

      setCart(data?.cart ?? { items: [] });
      setTotal(data?.total ?? 0);
    } catch {
      // Network error → still show empty cart
      setCart({ items: [] });
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * Update quantity (safe)
   */
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await fetch("http://localhost:3000/api/v1/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
    } catch {
      // ignore
    }

    fetchCart();
  };

  /**
   * Remove item (safe)
   */
  const removeItem = async (productId) => {
    try {
      await fetch(`http://localhost:3000/api/v1/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // ignore
    }

    fetchCart();
  };

  /* ---------------- RENDER SAFETY ---------------- */

  if (loading) return <p className="cart-loading">Loading cart...</p>;

  // Always render empty state safely
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return <p className="cart-empty">Your cart is empty</p>;
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cart.items
          .filter((item) => item?.productId) // 🔥 critical safety guard
          .map((item) => (
            <div key={item.productId._id} className="cart-item">
              <div className="cart-info">
                <h2>{item.productId.name}</h2>
                <p>{item.productId.description}</p>
              </div>

              <div className="cart-controls">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId._id,
                      item.quantity - 1
                    )
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId._id,
                      item.quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>

              <div className="cart-price">
                ₹{item.productId.price * item.quantity}
              </div>

              <button
                className="cart-remove"
                onClick={() => {
                  console.log("Removing", item.productId._id);
                  removeItem(item.productId._id);
                }}
              >
                ✕
              </button>
            </div>
          ))}
      </div>

      <div className="cart-summary">
        <h2>Total</h2>
        <span className="cart-total">₹{total}</span>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}

export default Cart;

