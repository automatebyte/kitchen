import React, { useState, useEffect } from 'react';
import CategoryItem from './CategoryItem';
import { getCategories, createCategory } from '../../services/categoryService';

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      await createCategory(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="categories-list">
      <h2>Menu Categories</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Category'}
      </button>
      
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
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
          <button type="submit">Create Category</button>
        </form>
      )}
      
      <div className="categories">
        {categories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default CategoriesList;