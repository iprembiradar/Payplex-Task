import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Pages.css";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    if (savedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      if (!loggedInUser) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const orderData = {
        userId: loggedInUser.id,
        items: cartItems.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.thumbnail
        })),
        shippingAddress: shipping,
        paymentMethod,
        totalAmount
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders/place",
        orderData
      );

      if (res.data.success) {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/order-success", { state: { order: res.data.order } });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log("PLACE ORDER ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-wrapper">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h3>Shipping Details</h3>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={shipping.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={shipping.phone}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shipping.address}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={shipping.city}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={shipping.pincode}
            onChange={handleChange}
            required
          />

          <h3>Payment</h3>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <p>{item.title}</p>
              <p>
                ₹ {item.price} x {item.quantity}
              </p>
            </div>
          ))}

          <h4>Total: ₹ {totalAmount}</h4>
        </div>
      </div>
    </div>
  );
};

export default Checkout;