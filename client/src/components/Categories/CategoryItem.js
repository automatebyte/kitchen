import React from 'react';

function CategoryItem({ category }) {
  return (
    <div className="category-item">
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </div>
  );
}

export default CategoryItem;