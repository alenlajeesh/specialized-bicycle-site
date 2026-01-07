import "../styles/auth.css";

function Register() {
  return (
    <div className="auth-container">
      <h2>Create an Account</h2>

      <input placeholder="Email" />
      <input placeholder="Password" />
      <input placeholder="Confirm Password" />
      <input placeholder="First Name" />
      <input placeholder="Last Name" />

      <button>Create Account</button>
    </div>
  );
}

export default Register;

