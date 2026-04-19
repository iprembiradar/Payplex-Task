import { Link, useLocation } from "react-router-dom";
import "../styles/Pages.css";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="success-container">
      <h2>Order Confirmed 🎉</h2>
      <p>Your order has been placed successfully.</p>

      {order && (
        <div className="success-box">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          <p><strong>Total:</strong> ₹ {order.totalAmount}</p>
        </div>
      )}

      <Link to="/orders">View My Orders</Link>
    </div>
  );
};

export default OrderSuccess;