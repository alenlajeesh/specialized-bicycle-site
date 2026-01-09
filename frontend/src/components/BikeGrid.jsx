import "../styles/bikeGrid.css";

// placeholder images
import tarmacImg from "../assets/bike5.webp";
import turboLevoImg from "../assets/bike6.webp";
import epicImg from "../assets/bike7.webp";
import turboVadoImg from "../assets/bike8.webp";
import roubaixImg from "../assets/bike9.webp";
import divergeImg from "../assets/bike10.webp";

const bikes = [
  {
    title: "Tarmac",
    subtitle: "One Bike To Rule Them All",
    image: tarmacImg,
  },
  {
    title: "Turbo Levo",
    subtitle: "Where Super Meets Natural",
    image: turboLevoImg,
  },
  {
    title: "Epic",
    subtitle: "Evolution of the Fastest",
    image: epicImg,
  },
  {
    title: "Turbo Vado",
    subtitle: "Calling it an e-bike is an insult",
    image: turboVadoImg,
  },
  {
    title: "Roubaix",
    subtitle: "Comfort Without Compromise",
    image: roubaixImg,
  },
  {
    title: "Diverge",
    subtitle: "Any Road, Any Ride",
    image: divergeImg,
  },
];

function BikeGrid() {
  return (
    <section className="bike-grid">
      {bikes.map((bike) => (
        <div className="bike-card" key={bike.title}>
          <img src={bike.image} alt={bike.title} />
          <div className="bike-overlay">
            <h3>{bike.title}</h3>
            <p>{bike.subtitle}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default BikeGrid;

