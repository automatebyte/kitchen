import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/menuService';
import { getCategories } from '../../services/categoryService';

import { useAuth } from '../../context/AuthContext';

function MenuList({ onAddToCart, userId, isAuthenticated }) {
  const { isAdmin } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await getMenuItems();
      setMenuItems(items);
      setFilteredItems(items);
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
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id)
      };
      
      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
        setEditingItem(null);
      } else {
        await createMenuItem(itemData);
      }
      
      setFormData({ name: '', description: '', price: '', category_id: '', image_url: '' });
      setShowForm(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category_id: item.category_id.toString(),
      image_url: item.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterItems(term, selectedCategory);
    if (term) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    filterItems(searchTerm, categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterItems = (search, category) => {
    let filtered = menuItems;
    
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(item => item.category_id.toString() === category);
    }
    
    setFilteredItems(filtered);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category_id: '', image_url: '' });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleAddToCart = async (menuItemId) => {
    if (onAddToCart) {
      onAddToCart(menuItemId);
    }
  };

  if (loading) return <div>Loading menu...</div>;

  return (
    <div className="page-container">
      <div className="hero">
        <h1>Our Menu</h1>
        <p>Discover our carefully crafted dishes made with the finest ingredients</p>
      </div>
      
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('')}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id.toString() ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(cat.id.toString())}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
      {isAdmin && (
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        </button>
      )}
      
      {showForm && isAdmin && (
        <div className="form-container">
          <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price ($)"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
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
            <div style={{display: 'flex', gap: '1rem'}}>
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update Item' : 'Create Item'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading menu items...</div>
      ) : (
        <div className="menu-items">
          {filteredItems.map(item => (
            <MenuItem 
              key={item.id} 
              item={item} 
              onEdit={isAdmin ? handleEdit : null}
              onDelete={isAdmin ? handleDelete : null}
              onAddToCart={handleAddToCart}
              userId={userId}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuList;