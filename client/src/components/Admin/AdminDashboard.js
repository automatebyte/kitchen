import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCategories } from '../../services/categoryService';
import { getMenuItems } from '../../services/menuService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category_id: '', image_url: '' });

  useEffect(() => {
    if (isAdmin) {
      loadDashboard();
      loadOrders();
      loadCategories();
      loadMenuItems();
    }
  }, [isAdmin]);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard?user_id=${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/orders/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadMenuItems = async () => {
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user?.id, status: newStatus })
      });
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingCategory 
        ? `${API_BASE_URL}/api/admin/categories/${editingCategory.id}`
        : `${API_BASE_URL}/api/admin/categories`;
      const method = editingCategory ? 'PATCH' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...categoryForm, user_id: user?.id })
      });
      
      setCategoryForm({ name: '', description: '' });
      setEditingCategory(null);
      setShowCategoryForm(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingMenuItem 
        ? `${API_BASE_URL}/api/admin/menu-items/${editingMenuItem.id}`
        : `${API_BASE_URL}/api/admin/menu-items`;
      const method = editingMenuItem ? 'PATCH' : 'POST';
      
      const formData = {
        ...menuForm,
        price: parseFloat(menuForm.price),
        category_id: parseInt(menuForm.category_id),
        user_id: user?.id
      };
      
      await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      setMenuForm({ name: '', description: '', price: '', category_id: '', image_url: '' });
      setEditingMenuItem(null);
      setShowMenuForm(false);
      loadMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user?.id })
      });
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const deleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/admin/menu-items/${itemId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user?.id })
      });
      loadMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description || '' });
    setShowCategoryForm(true);
  };

  const editMenuItem = (item) => {
    setEditingMenuItem(item);
    setMenuForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id.toString(),
      image_url: item.image_url || ''
    });
    setShowMenuForm(true);
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            {stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <h3>Total Users</h3>
                  <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_users}</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <h3>Total Orders</h3>
                  <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_orders}</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <h3>Menu Items</h3>
                  <p style={{ fontSize: '2rem', margin: 0 }}>{stats.total_menu_items}</p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                  <h3>Pending Orders</h3>
                  <p style={{ fontSize: '2rem', margin: 0 }}>{stats.pending_orders}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div>
            <h2>Order Management</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Order ID</th>
                    <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Customer</th>
                    <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Total</th>
                    <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Status</th>
                    <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Date</th>
                    <th style={{ padding: '1rem', border: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{order.id}</td>
                      <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{order.username}</td>
                      <td style={{ padding: '1rem', border: '1px solid #ddd' }}>${order.total_amount?.toFixed(2)}</td>
                      <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '3px',
                          backgroundColor: order.status === 'pending' ? '#fff3cd' : 
                                         order.status === 'completed' ? '#d4edda' : 
                                         order.status === 'preparing' ? '#cce5ff' :
                                         order.status === 'ready' ? '#d1ecf1' : '#f8d7da'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={{ padding: '0.25rem' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'categories':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Category Management</h2>
              <button 
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                Add Category
              </button>
            </div>
            
            {showCategoryForm && (
              <form onSubmit={handleCategorySubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <textarea
                  placeholder="Description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', marginRight: '1rem' }}>
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowCategoryForm(false); setEditingCategory(null); setCategoryForm({ name: '', description: '' }); }} style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px' }}>
                  Cancel
                </button>
              </form>
            )}
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {categories.map(category => (
                <div key={category.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <h4>{category.name}</h4>
                  <p>{category.description}</p>
                  <button onClick={() => editCategory(category)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', marginRight: '0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteCategory(category.id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'menu':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Menu Management</h2>
              <button 
                onClick={() => setShowMenuForm(!showMenuForm)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
              >
                Add Menu Item
              </button>
            </div>
            
            {showMenuForm && (
              <form onSubmit={handleMenuSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <textarea
                  placeholder="Description"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={menuForm.price}
                  onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <select
                  value={menuForm.category_id}
                  onChange={(e) => setMenuForm({...menuForm, category_id: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={menuForm.image_url}
                  onChange={(e) => setMenuForm({...menuForm, image_url: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', marginRight: '1rem' }}>
                  {editingMenuItem ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowMenuForm(false); setEditingMenuItem(null); setMenuForm({ name: '', description: '', price: '', category_id: '', image_url: '' }); }} style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px' }}>
                  Cancel
                </button>
              </form>
            )}
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {menuItems.map(item => (
                <div key={item.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <p><strong>Price: ${item.price}</strong></p>
                  <p>Category: {item.category?.name}</p>
                  <p>Available: {item.available ? 'Yes' : 'No'}</p>
                  <button onClick={() => editMenuItem(item)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', marginRight: '0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteMenuItem(item.id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: activeTab === 'dashboard' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'dashboard' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '3px'
          }}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: activeTab === 'orders' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'orders' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '3px'
          }}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: activeTab === 'categories' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'categories' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '3px'
          }}
        >
          Categories
        </button>
        <button 
          onClick={() => setActiveTab('menu')}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'menu' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'menu' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '3px'
          }}
        >
          Menu Items
        </button>
      </div>
      
      {renderTabContent()}

    </div>
  );
}

export default AdminDashboard;