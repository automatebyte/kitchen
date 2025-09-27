import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import MenuList from '../components/Menu/MenuList';
import { orderService } from '../services/orderService';

function MenuPage() {
  const { user, isAuthenticated } = useAuth();
  const history = useHistory();

  const handleAddToCart = async (menuItemId, quantity = 1) => {
    if (!isAuthenticated) {
      const shouldLogin = window.confirm('Please login to add items to cart. Would you like to go to the login page?');
      if (shouldLogin) {
        history.push('/login');
      }
      return;
    }
    
    try {
      await orderService.addToCart({
        user_id: user.id,
        menu_item_id: menuItemId,
        quantity: quantity
      });
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  return (
    <div className="menu-page">
      <MenuList 
        onAddToCart={handleAddToCart}
        userId={user?.id}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

export default MenuPage;