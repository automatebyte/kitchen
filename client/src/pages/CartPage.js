import React from 'react';
import { useAuth } from '../context/AuthContext';
import Cart from '../components/Orders/Cart';
import Login from '../components/Auth/Login';

function CartPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Please login to view your cart</h2>
        <Login />
      </div>
    );
  }

  return (
    <div>
      <Cart userId={user.id} />
    </div>
  );
}

export default CartPage;