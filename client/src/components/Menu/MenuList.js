import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import { getMenuItems, createMenuItem } from '../../services/menuService';
import { getCategories } from '../../services/categoryService';

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: ''
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMenuItem({
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id)
      });
      setFormData({ name: '', description: '', price: '', category_id: '' });
      setShowForm(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error creating menu item:', error);
    }
  };

  if (loading) return <div>Loading menu...</div>;

  return (
    <div className="menu-list">
      <h2>Our Menu</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Menu Item'}
      </button>
      
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button type="submit">Create Item</button>
        </form>
      )}
      
      <div className="menu-items">
        {menuItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default MenuList;