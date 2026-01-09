import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/">Home</Link>
        </div>

        <div className="nav-right">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Profile</Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

