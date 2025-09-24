import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import { getMenuItems } from '../../services/menuService';

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading menu...</div>;

  return (
    <div className="menu-list">
      <h2>Our Menu</h2>
      <div className="menu-items">
        {menuItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default MenuList;