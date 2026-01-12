import { useEffect, useState, useCallback } from "react";
import "../styles/cart.css";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setCart({ items: [] });
        setTotal(0);
        return;
      }

      const data = await res.json();
      setCart(data?.cart ?? { items: [] });
      setTotal(data?.total ?? 0);
    } catch {
      setCart({ items: [] });
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [token, BASE_URL]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    await fetch(`${BASE_URL}/api/v1/cart/update`, {
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
    await fetch(`${BASE_URL}/api/v1/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchCart();
  };

  if (loading) return <p className="cart-loading">Loading cart...</p>;

  if (!cart?.items?.length) {
    return <p className="cart-empty">Your cart is empty</p>;
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cart.items
          .filter((item) => item?.productId)
          .map((item) => {
            const product = item.productId;

            return (
              <div key={product._id} className="cart-item">
                {/* IMAGE */}
                <div className="cart-image">
                  <img
                    src={`${BASE_URL}${product.imageUrl}`}
                    alt={product.name}
                  />
                </div>

                {/* INFO */}
                <div className="cart-info">
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <span className="cart-price">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>

                {/* QUANTITY */}
                <div className="cart-controls">
                  <button
                    onClick={() =>
                      updateQuantity(product._id, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* SUBTOTAL */}
                <div className="cart-subtotal">
                  ₹{(product.price * item.quantity).toLocaleString()}
                </div>

                {/* REMOVE */}
                <button
                  className="cart-remove"
                  onClick={() => removeItem(product._id)}
                >
                  ✕
                </button>
              </div>
            );
          })}
      </div>

      <div className="cart-summary">
        <h2>Total</h2>
        <span className="cart-total">₹{total.toLocaleString()}</span>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}

export default Cart;

