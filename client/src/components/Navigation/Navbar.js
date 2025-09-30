import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [isAuthenticated, user?.id]);

  const loadCartCount = async () => {
    try {
      const cartData = await orderService.getCart(user.id);
      const count = cartData.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (error) {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.href = '/';
  };

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={handleNavClick}>Quick Bite</Link>
        
        <div className="nav-links">
          <Link to="/menu" onClick={handleNavClick}>Menu</Link>
          {isAuthenticated && (
            <>
              <Link to="/cart" onClick={handleNavClick}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
              <Link to="/orders" onClick={handleNavClick}>My Orders</Link>
              {isAdmin && (
                <Link to="/admin" onClick={handleNavClick}>Admin Dashboard</Link>
              )}
            </>
          )}
          
          {isAuthenticated ? (
            <>
              <span style={{ 
                color: 'var(--text-light)', 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Welcome, {user?.username}!
              </span>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-small"
                style={{ marginLeft: '0.5rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-small" onClick={handleNavClick}>Login</Link>
              <Link to="/register" className="btn btn-secondary btn-small" onClick={handleNavClick}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;