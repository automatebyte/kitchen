import React, { useState, useEffect } from 'react';
import CategoryItem from './CategoryItem';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        setEditingCategory(null);
      } else {
        await createCategory(formData);
      }
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="page-container">
      <div className="hero">
        <h1>Menu Categories</h1>
        <p>Organize and manage your menu categories</p>
      </div>
      
      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : editingCategory ? 'Edit Category' : 'Add Category'}
      </button>
      
      {showForm && (
        <div className="form-container">
          <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
            <div style={{display: 'flex', gap: '1rem'}}>
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <div className="categories">
          {categories.map(category => (
            <CategoryItem 
              key={category.id} 
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesList;