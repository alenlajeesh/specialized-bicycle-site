import "../styles/hero.css";
import heroImage from "../assets/homepage.webp";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>S-Works Tarmac SL8</h1>

        <h2>Dream Build: The Complete Package</h2>

        <p>
          Build your Tarmac SL8 Dream Bike with our exclusive complete packages
          – available on selected S-Works Tarmac SL8 Framesets paired with
          best-in-class components customized to your preferences. Contact your
          preferred Specialized retailer and secure your Dream Build while
          stocks last!
        </p>

        <button>Build Yours</button>
      </div>

      <div className="hero-image">
        <img src={heroImage} alt="Homepage Hero" />
      </div>
    </section>
  );
}

export default Hero;

 
