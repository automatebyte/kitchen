import React from 'react';

function CategoryItem({ category, onEdit, onDelete }) {
  return (
    <div className="category-item">
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      
      {(onEdit || onDelete) && (
        <div className="action-buttons">
          {onEdit && (
            <button 
              className="btn btn-secondary btn-small"
              onClick={() => onEdit(category)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button 
              className="btn btn-danger btn-small"
              onClick={() => onDelete(category.id)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryItem;