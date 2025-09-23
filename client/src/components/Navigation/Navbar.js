import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none' }}>Home</Link>
      <Link to="/login" style={{ marginRight: '1rem', textDecoration: 'none' }}>Login</Link>
      <Link to="/register" style={{ marginRight: '1rem', textDecoration: 'none' }}>Register</Link>
      <Link to="/orders" style={{ textDecoration: 'none' }}>Orders</Link>
    </nav>
  );
}

export default Navbar;