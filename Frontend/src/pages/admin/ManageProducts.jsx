import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Pages.css";

const ManageProducts = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    description: "",
    stock: ""
  });

  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.log("FETCH PRODUCTS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/products/add",
        form
      );

      if (res.data.success) {
        alert("Product added successfully ✅");

        setForm({
          title: "",
          price: "",
          category: "",
          image: "",
          description: "",
          stock: ""
        });

        fetchProducts();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log("ADD PRODUCT ERROR:", error);
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/products/${id}`);

      if (res.data.success) {
        alert("Product deleted successfully ✅");
        fetchProducts();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log("DELETE PRODUCT ERROR:", error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="admin-product-container">
      <h2>Add Product</h2>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Product</button>
      </form>

      <h2 className="admin-list-title">All Products</h2>

      <div className="admin-product-list">
        {products.map((item) => (
          <div key={item._id} className="admin-product-card">
            <img src={item.image} alt={item.title} className="admin-product-image" />
            <h3>{item.title}</h3>
            <p>₹ {item.price}</p>
            <p>{item.category}</p>
            <p>Stock: {item.stock}</p>

            <button
              className="delete-btn"
              onClick={() => handleDelete(item._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;