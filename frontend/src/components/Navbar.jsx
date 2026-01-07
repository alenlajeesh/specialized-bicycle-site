import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <>
      <div className="top-bar">
        Pay at your own pace, starting at 0% APR with Affirm
      </div>

      <header className="navbar">
        <Link to="/" className="logo">SPECIALIZED</Link>

        <nav className="nav-links">
          <Link to="/bikes">Bikes</Link>
          <a href="#">Gear</a>
          <a href="#">Sale</a>
        </nav>

        <div className="nav-icons">
          <Link to="/login">Login</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </header>
    </>
  );
}

export default Navbar;

