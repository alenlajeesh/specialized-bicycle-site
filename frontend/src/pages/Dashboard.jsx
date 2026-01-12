import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    imageUrl: "",
  });

  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in!");
	 navigate("/login");

      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      setError("Invalid token. Please login again.");
    }
  }, []);

  // 🔴 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) return <p className="dashboard-error">{error}</p>;
  if (!user) return <p>Loading...</p>;

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!selectedFile) return "";

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setUploading(false);
      return data.imageUrl;
    } catch (err) {
      setUploading(false);
      setProductError("Image upload failed");
      return "";
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductError("");
    setProductSuccess("");

    if (!selectedFile) {
      setProductError("Please select an image before submitting");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const imageUrl = await uploadImage();
      if (!imageUrl) return;

      const productToSend = { ...productData, imageUrl };

      const res = await fetch(`${BASE_URL}/api/v1/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productToSend),
      });

      const data = await res.json();
      if (!res.ok) {
        setProductError(data.message || "Failed to add product");
        return;
      }

      setProductSuccess("Product added successfully!");
      setProductData({
        name: "",
        price: "",
        color: "",
        size: "",
        stock: "",
        category: "Bike",
        description: "",
        isActive: true,
        imageUrl: "",
      });
      setSelectedFile(null);
    } catch (err) {
      setProductError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* 🔴 LOGOUT BUTTON (VISIBLE TO ALL USERS) */}
      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>

      <h1>Welcome, {user.username}!</h1>
      <p>Your role: {user.role}</p>

      {user.role === "admin" ? (
        <div className="admin-section">
          <h2>Admin Panel - Add Product</h2>

          {productError && <p className="product-error">{productError}</p>}
          {productSuccess && (
            <p className="product-success">{productSuccess}</p>
          )}

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
            />

            <label>
              Active:
              <input
                type="checkbox"
                name="isActive"
                checked={productData.isActive}
                onChange={handleProductChange}
              />
            </label>

            <label>
              Upload Image:
              <input type="file" onChange={handleFileChange} />
            </label>

            {uploading && <p>Uploading image...</p>}

            <button type="submit" disabled={uploading}>
              Add Product
            </button>
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

