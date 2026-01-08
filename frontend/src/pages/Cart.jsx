import { useEffect, useState } from "react";
import "../styles/cart.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCart(data.cart);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    await fetch("http://localhost:3000/api/v1/cart/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    fetchCart();
  };

  const removeItem = async (productId) => {
    await fetch(`http://localhost:3000/api/v1/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
		

    fetchCart();
  };

  if (loading) return <p className="cart-loading">Loading cart...</p>;
  if (error) return <p className="cart-error">{error}</p>;
  if (!cart || cart.items.length === 0)
    return <p className="cart-empty">Your cart is empty</p>;

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId._id} className="cart-item">
            <div className="cart-info">
              <h2>{item.productId.name}</h2>
              <p>{item.productId.description}</p>
            </div>

            <div className="cart-controls">
              <button
                onClick={() =>
                  updateQuantity(item.productId._id, item.quantity - 1)
                }
              >
                −
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.productId._id, item.quantity + 1)
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
              onClick={() => removeItem(item.productId._id)}
            >
				{console.log("Removing", item.productId._id)}
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

