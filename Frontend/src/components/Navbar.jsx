import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../styles/Navbar.css";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout successful");
    navigate("/login");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${search}`);
  };

  return (
    <nav className="navbar">
      <h2 className="logo">PREMS SHOPPING CLUB</h2>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartCount})</Link>

        {user && user.role !== "admin" && <Link to="/orders">My Orders</Link>}

        {user && user.role === "admin" && (
          <>
            <Link to="/admin/products">Admin Products</Link>
            <Link to="/admin/orders">Admin Orders</Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;