import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Pages.css";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const allProducts = res.data.products || [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.log("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search");

    if (!query) {
      setFilteredProducts(products);
    } else {
      const result = products.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(result);
    }
  }, [location.search, products]);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const productExists = existingCart.find((item) => item.id === product._id);

    if (productExists) {
      const updatedCart = existingCart.map((item) =>
        item.id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const newProduct = {
        id: product._id,
        title: product.title,
        price: product.price,
        thumbnail: product.image,
        quantity: 1
      };

      localStorage.setItem(
        "cart",
        JSON.stringify([...existingCart, newProduct])
      );
    }

    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Product added to cart ✅");
  };

  return (
    <div className="home-container">
      <h1>Welcome to Prems Shopping Club 🛍️</h1>
      <p>Best place to buy amazing products.</p>

      {loading ? (
        <h3>Loading products...</h3>
      ) : filteredProducts.length === 0 ? (
        <h3>No products found</h3>
      ) : (
        <div className="product-list">
          {filteredProducts.map((item) => (
            <div key={item._id} className="product-card">
              <img
                src={item.image}
                alt={item.title}
                className="product-image"
              />
              <h3>{item.title}</h3>
              <p className="product-category">{item.category}</p>
              <p className="product-price">₹ {item.price}</p>
              <p>{item.description}</p>
              <p>Stock: {item.stock}</p>

              <button onClick={() => handleAddToCart(item)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;