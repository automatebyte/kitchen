import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';

function Cart({ userId }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadCart();
    }
  }, [userId]);

  const loadCart = async () => {
    try {
      const cartData = await orderService.getCart(userId);
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await orderService.removeFromCart(cartId);
      loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const createOrder = async () => {
    if (cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      await orderService.createOrder({ user_id: userId });
      alert('Order created successfully!');
      setCart({ items: [], total: 0 });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Shopping Cart</h2>
      
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.id} style={{ 
              border: '1px solid #ddd', 
              padding: '1rem', 
              margin: '1rem 0',
              borderRadius: '5px'
            }}>
              <h4>{item.menu_item?.name}</h4>
              <p>Price: ${item.menu_item?.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Subtotal: ${item.subtotal?.toFixed(2)}</p>
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem 1rem',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ))}
          
          <div style={{ 
            borderTop: '2px solid #333', 
            paddingTop: '1rem', 
            marginTop: '2rem' 
          }}>
            <h3>Total: ${cart.total?.toFixed(2)}</h3>
            <button 
              onClick={createOrder}
              disabled={loading}
              style={{ 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                padding: '1rem 2rem',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem'
              }}
            >
              {loading ? 'Creating Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;