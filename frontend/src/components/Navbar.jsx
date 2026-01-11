import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <button className="top-bar-btn">
            <img src="src\assets\downArrow.svg" alt="collapse" />
          </button>

          <span className="top-bar-text">
            Tarmac Dream Build: The Complete Package - available on selected
            S-Works Tarmac SL8 Framesets paired with best-in-class components
            customized to your preferences.
          </span>
        </div>

        <div className="top-bar-right">
          <a href="#">Support Center</a>
          <span className="divider">|</span>
          <a href="#">Find a Store</a>
          <span className="divider">|</span>

          <span className="location">
            <img src="src\assets\locationIcon.svg" alt="location" />
            560001
          </span>
        </div>
      </div>

      <header className="navbar">
        <Link to="/" className="logo">
          <img src="src\assets\logo.svg" alt="Specialized Bicycle Logo" />
        </Link>

        <nav className="nav-links">
          <Link to="/bikes">Bikes</Link>
          <a href="#">Gear</a>
          <a href="#">Sale</a>
        </nav>

        <div className="nav-icons">
          <Link to="/">
            <img src="src\assets\searchIcon.svg" alt="search" />
          </Link>

          <Link to="/cart">
            <img src="src\assets\shoppingCartIcon.svg" alt="cart" />
          </Link>

          <Link to="/login">
            <img src="src\assets\profileIcon.svg" alt="login" />
          </Link>

          <Link to="/">
            <img src="src\assets\breadCrumbsIcon.svg" alt="breadcrumbs" />
          </Link>
        </div>
      </header>
    </>
  );
}

export default Navbar;

