import { useState } from "react";
import "../styles/auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
	const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token in localStorage (or context)
      localStorage.setItem("token", data.token);

      alert("Logged in successfully!");
      // Optional: redirect to dashboard or home page
      window.location.href = "/";
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <form className="auth-container" onSubmit={handleSubmit}>
      <h2>Sign in to your Account</h2>

      {error && <p className="auth-error">{error}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign In</button>

      <p>
        Don’t have an account? <a href="/register">Create Account</a>
      </p>
    </form>
  );
}

export default Login;


