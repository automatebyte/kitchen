import React, { useState, useEffect } from 'react';
import CategoryItem from './CategoryItem';
import { getCategories } from '../../services/categoryService';

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="categories-list">
      <h2>Menu Categories</h2>
      <div className="categories">
        {categories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export default CategoriesList;