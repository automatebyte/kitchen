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

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await orderService.updateCartQuantity(cartId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const removeFromCart = async (cartId) => {
    if (!window.confirm('Remove this item from cart?')) return;
    
    try {
      await orderService.removeFromCart(cartId);
      await loadCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const createOrder = async () => {
    if (cart.items.length === 0) {
      return;
    }

    setLoading(true);
    try {
      await orderService.createOrder({ user_id: userId });
      setCart({ items: [], total: 0 });
      // Refresh cart and scroll to top
      await loadCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                <span>Quantity:</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  style={{ 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.25rem 0.5rem',
                    borderRadius: '3px',
                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{ minWidth: '2rem', textAlign: 'center' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.25rem 0.5rem',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
              <p><strong>Subtotal: ${item.subtotal?.toFixed(2)}</strong></p>
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => window.location.href = '/checkout'}
                style={{ 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1rem 2rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  flex: 1
                }}
              >
                Proceed to Checkout
              </button>
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
                  fontSize: '1.1rem',
                  flex: 1
                }}
              >
                {loading ? 'Creating Order...' : 'Quick Order'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;