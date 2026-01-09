import { useEffect, useState } from "react";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
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
    imageUrl: "", // store uploaded image URL
  });

  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState("");

  // Image file state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in!");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      setError("Invalid token. Please login again.");
    }
  }, []);

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

  // Upload image to backend and return URL
  const uploadImage = async () => {
    if (!selectedFile) return "";

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://localhost:3000/api/v1/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setUploading(false);
      return data.imageUrl; // <-- return image URL
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

      // 1️⃣ Upload image first
      const imageUrl = await uploadImage();
      if (!imageUrl) return;

      // 2️⃣ Attach image URL to product
      const productToSend = { ...productData, imageUrl };

      // 3️⃣ Send product data to backend
      const res = await fetch("http://localhost:3000/api/v1/products", {
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

            {/* File input */}
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

