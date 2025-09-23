import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';

function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
              <p><strong>Order #{order.id}</strong></p>
              <p>Total: ${order.total_amount}</p>
              <p>Status: {order.status}</p>
              <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersList;