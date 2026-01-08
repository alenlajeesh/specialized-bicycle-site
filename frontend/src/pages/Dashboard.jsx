import { useEffect, useState } from "react";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null); // store user info from token
  const [error, setError] = useState("");

  // Product form state
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    color: "",
    size: "",
    stock: "",
    category: "Bike",
    description: "",
    isActive: true,
  });

  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in!");
      return;
    }

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload); // should include username and role
    } catch (err) {
      setError("Invalid token. Please login again.");
    }
  }, []);

  if (error) {
    return <p className="dashboard-error">{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  // Handle product form input
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle product form submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductError("");
    setProductSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        setProductError(data.message || "Failed to add product");
        return;
      }

      setProductSuccess("Product added successfully!");
      // Reset form
      setProductData({
        name: "",
        price: "",
        color: "",
        size: "",
        stock: "",
        category: "Bike",
        description: "",
        isActive: true,
      });
    } catch (err) {
      setProductError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username}!</h1>
      <p>Your role: {user.role}</p>

      {user.role === "admin" ? (
        <div className="admin-section">
          <h2>Admin Panel - Add Product</h2>

          {productError && <p className="product-error">{productError}</p>}
          {productSuccess && <p className="product-success">{productSuccess}</p>}

          <form className="product-form" onSubmit={handleProductSubmit}>
            <input
              name="name"
              placeholder="Product Name"
              value={productData.name}
              onChange={handleProductChange}
              required
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={productData.price}
              onChange={handleProductChange}
              required
            />

            <input
              name="color"
              placeholder="Color"
              value={productData.color}
              onChange={handleProductChange}
              required
            />

            <input
              name="size"
              type="number"
              placeholder="Size"
              value={productData.size}
              onChange={handleProductChange}
              required
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock Quantity"
              value={productData.stock}
              onChange={handleProductChange}
              required
            />

            <select
              name="category"
              value={productData.category}
              onChange={handleProductChange}
              required
            >
              <option value="Bike">Bike</option>
              <option value="Gear">Gear</option>
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={productData.description}
              onChange={handleProductChange}
              required
            ></textarea>

            <label>
              Active:
              <input
                type="checkbox"
                name="isActive"
                checked={productData.isActive}
                onChange={handleProductChange}
              />
            </label>

            <button type="submit">Add Product</button>
          </form>
        </div>
      ) : (
        <div className="user-section">
          <h2>User Dashboard</h2>
          <p>Browse products and enjoy your account.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

