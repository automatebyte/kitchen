import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';

function Checkout() {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const cartData = await orderService.getCart(user.id);
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const placeOrder = async () => {
    if (cart.items.length === 0) return;

    setLoading(true);
    try {
      const order = await orderService.createOrder({ user_id: user.id });
      setOrderDetails(order);
      setOrderPlaced(true);
      setCart({ items: [], total: 0 });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="success-card">
          <h2>✅ Order Placed Successfully!</h2>
          <div className="order-summary">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> #{orderDetails?.id}</p>
            <p><strong>Total:</strong> ${orderDetails?.total_amount?.toFixed(2)}</p>
            <p><strong>Status:</strong> {orderDetails?.status}</p>
            <p><strong>Date:</strong> {new Date(orderDetails?.created_at).toLocaleDateString()}</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/menu'}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/menu'}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="checkout-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cart.items.map(item => (
              <div key={item.id} className="checkout-item">
                <span>{item.menu_item?.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>${item.subtotal?.toFixed(2)}</span>
              </div>
            ))}
            <div className="total">
              <strong>Total: ${cart.total?.toFixed(2)}</strong>
            </div>
          </div>

          <div className="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>

          <button 
            className="btn btn-primary checkout-btn"
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Checkout;