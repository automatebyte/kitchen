import React, { useState } from 'react';

function CreateOrder() {
  const [orderData, setOrderData] = useState({
    user_id: 1,
    total_amount: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const result = await response.json();
      console.log('Order created:', result);
      setOrderData({ user_id: 1, total_amount: '' });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
      <h3>Create New Order</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="number"
            placeholder="Total Amount"
            value={orderData.total_amount}
            onChange={(e) => setOrderData({...orderData, total_amount: e.target.value})}
            style={{ width: '100%', padding: '0.5rem' }}
            step="0.01"
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>Create Order</button>
      </form>
    </div>
  );
}

export default CreateOrder;