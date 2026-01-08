import "../styles/shopCategories.css";

// import images like Hero
import roadImg from "../assets/bike1.webp";
import electricImg from "../assets/bike2.webp";
import mountainImg from "../assets/bike3.webp";
import activeImg from "../assets/bike4.webp";

const categories = [
  {
    title: "Road Bikes",
    image: roadImg,
  },
  {
    title: "Electric Bikes",
    image: electricImg,
  },
  {
    title: "Mountain Bikes",
    image: mountainImg,
  },
  {
    title: "Active Bikes",
    image: activeImg,
  },
];

function ShopCategories() {
  return (
    <section className="shop-section">
      <h2>Shop</h2>

      <div className="shop-cards">
        {categories.map((cat) => (
          <div className="shop-card" key={cat.title}>
            <img src={cat.image} alt={cat.title} />
            <div className="shop-overlay">
              <h3>{cat.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShopCategories;

