import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Pages.css";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${user.id}`
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.log("FETCH ORDERS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`
      );

      if (res.data.success) {
       toast.error("Order cancelled successfully ❌");
        fetchOrders();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log("CANCEL ERROR:", error);
     toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orderrrs found</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total Amount:</strong> ₹ {order.totalAmount}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p><strong>Order Status:</strong> {order.orderStatus}</p>

              <div className="order-items-box">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <span>{item.title}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>₹ {item.price}</span>
                  </div>
                ))}
              </div>

              {order.orderStatus !== "Delivered" &&
                order.orderStatus !== "Cancelled" && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel order
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;