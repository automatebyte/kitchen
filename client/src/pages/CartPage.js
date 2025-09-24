import React from 'react';
import Cart from '../components/Orders/Cart';

function CartPage() {
  // For demo purposes, using user ID 1. In a real app, get from auth context
  const userId = 1;

  return (
    <div>
      <Cart userId={userId} />
    </div>
  );
}

export default CartPage;