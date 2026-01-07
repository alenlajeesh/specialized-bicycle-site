import "../styles/auth.css";

function Login() {
  return (
    <div className="auth-container">
      <h2>Sign in to your Account</h2>

      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button disabled>Sign In</button>

      <p>
        Don’t have an account? <a href="/register">Create Account</a>
      </p>
    </div>
  );
}

export default Login;

