import "../styles/appPromo.css";
import heroImage from "../assets/appBike.webp";

function AppPromo() {
  return (
    <section className="app-promo">
      <img src={heroImage} alt="Specialized App" />

      <div className="app-content">
        <h2>Unleash Your Dream Ride</h2>
        <p>
          Get fitter, faster, and smarter with the Specialized App—featuring
          performance tracking, Turbo e-bike management, and more.
        </p>
        <button>Download the App</button>
      </div>
    </section>
  );
}

export default AppPromo;

