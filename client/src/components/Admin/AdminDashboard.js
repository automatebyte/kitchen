import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555';

function AdminDashboard({ userId, isAdmin }) {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      loadDashboard();
      loadOrders();
    }
  }, [isAdmin]);

  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard?user_id=${userId}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, status: newStatus })
      });
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_users}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3>Total Orders</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_orders}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3>Menu Items</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_menu_items}</p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
            <h3>Pending Orders</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>{stats.pending_orders}</p>
          </div>
        </div>
      )}

      <h2>All Orders</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Order ID</th>
              <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Customer</th>
              <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Total</th>
              <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{order.id}</td>
                <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{order.username}</td>
                <td style={{ padding: '1rem', border: '1px solid #ddd' }}>${order.total_amount?.toFixed(2)}</td>
                <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '3px',
                    backgroundColor: order.status === 'pending' ? '#fff3cd' : 
                                   order.status === 'completed' ? '#d4edda' : '#f8d7da'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    style={{ padding: '0.25rem' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;