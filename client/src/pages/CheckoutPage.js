import React from 'react';
import { useAuth } from '../context/AuthContext';
import Checkout from '../components/Orders/Checkout';
import Login from '../components/Auth/Login';

function CheckoutPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="auth-required">
          <h2>Please login to checkout</h2>
          <Login />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Checkout />
    </div>
  );
}

export default CheckoutPage;