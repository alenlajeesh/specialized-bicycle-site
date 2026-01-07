import BikeCard from "../components/BikeCard";
import "../styles/bikes.css";

function Bikes() {
  return (
    <div className="bikes-page">
      <h2>Bikes</h2>

      <div className="bike-grid">
        {[1,2,3,4,5,6].map((i) => (
          <BikeCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default Bikes;

