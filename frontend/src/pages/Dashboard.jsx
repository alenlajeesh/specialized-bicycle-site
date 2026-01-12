import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= STATE ================= */
  const [adminProducts, setAdminProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

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

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [productError, setProductError] = useState("");
  const [productSuccess, setProductSuccess] = useState("");

  /* ================= AUTH + FETCH PRODUCTS ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);

      fetch(`${BASE_URL}/api/v1/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setAdminProducts(data.products || []));
    } catch {
      setError("Invalid token. Please login again.");
    }
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async () => {
    if (!selectedFile) return productData.imageUrl;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      setUploading(false);
      return data.imageUrl;
    } catch {
      setUploading(false);
      setProductError("Image upload failed");
      return "";
    }
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProductError("");
    setProductSuccess("");

    try {
      const token = localStorage.getItem("token");
      let imageUrl = await uploadImage();
      if (!imageUrl) return;

      const payload = { ...productData, imageUrl };

      const res = await fetch(
        editingProductId
          ? `${BASE_URL}/api/v1/products/${editingProductId}`
          : `${BASE_URL}/api/v1/products`,
        {
          method: editingProductId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (editingProductId) {
        setAdminProducts((prev) =>
          prev.map((p) => (p._id === data._id ? data : p))
        );
        setProductSuccess("Product updated successfully");
      } else {
        setAdminProducts((prev) => [data, ...prev]);
        setProductSuccess("Product created successfully");
      }

      setEditingProductId(null);
      setSelectedFile(null);
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
    } catch (err) {
      setProductError(err.message || "Operation failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (product) => {
    setProductData(product);
    setEditingProductId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/v1/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setAdminProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || "Error deleting product");
    }
  };

  if (error) return <p className="dashboard-error">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>

      <h1>Welcome, {user.username}</h1>
      <p>Role: {user.role}</p>

      {user.role === "admin" && (
        <>
          {/* ================= PRODUCT FORM ================= */}
          <form className="product-form" onSubmit={handleSubmit}>
            <h2>{editingProductId ? "Edit Product" : "Create Product"}</h2>

            {productError && <p className="product-error">{productError}</p>}
            {productSuccess && (
              <p className="product-success">{productSuccess}</p>
            )}

            <input
              name="name"
              placeholder="Name"
              value={productData.name}
              onChange={handleChange}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={productData.price}
              onChange={handleChange}
              required
            />
            <input
              name="color"
              placeholder="Color"
              value={productData.color}
              onChange={handleChange}
              required
            />
            <input
              name="size"
              placeholder="Size"
              value={productData.size}
              onChange={handleChange}
              required
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={productData.stock}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
            >
              <option value="Bike">Bike</option>
              <option value="Gear">Gear</option>
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={productData.description}
              onChange={handleChange}
            />

            <label>
              Upload Image
              <input type="file" onChange={handleFileChange} />
            </label>

            {uploading && <p>Uploading image...</p>}

            <button type="submit" disabled={uploading}>
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
          </form>

          {/* ================= PRODUCTS STRIP ================= */}
          <div className="admin-products-strip">
            <h3>Your Products</h3>

            <div className="admin-products-row">
              {adminProducts.map((p) => (
                <div key={p._id} className="admin-product-card">
                  <img src={`${BASE_URL}${p.imageUrl}`} alt={p.name} />

                  <div className="card-info">
                    <strong>{p.name}</strong>
                    <span>₹{p.price}</span>
                  </div>

                  <div className="card-actions">
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
