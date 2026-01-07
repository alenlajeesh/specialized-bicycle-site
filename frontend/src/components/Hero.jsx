import "../styles/hero.css";
import heroImage from "../assets/homepage.webp";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="tagline">
          ALL-NEW RED BULL – BORA – HANSGROHE KIT
        </p>
        <h1>Ride Like Remco</h1>
        <button>Shop Now</button>
      </div>

      <div className="hero-image">
        <img src={heroImage} alt="Homepage Hero" />
      </div>
    </section>
  );
}

export default Hero;

 
