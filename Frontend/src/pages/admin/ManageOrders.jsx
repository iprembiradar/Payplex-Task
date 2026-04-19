import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Pages.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      // to manage product aip
     const res = await axios.get("http://localhost:5000/api/orders");  

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.log("FETCH ADMIN ORDERS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { orderStatus: newStatus }
      );

      if (res.data.success) {
        alert("Order status updated ✅");
        fetchOrders();
      }
    } catch (error) {
      console.log("UPDATE STATUS ERROR:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="orders-container">
      <h2>Manage Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total Amount:</strong> ₹ {order.totalAmount}</p>
              <p><strong>Current Status:</strong> {order.orderStatus}</p>

              <select
                value={order.orderStatus}
                onChange={(e) =>
                  handleStatusChange(order._id, e.target.value)
                }
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
