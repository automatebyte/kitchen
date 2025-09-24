import React from 'react';
import { orderService } from '../../services/orderService';

// Sample food images from Unsplash
const getDefaultFoodImage = (itemName) => {
  const foodImages = {
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    'chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    'pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    'sandwich': 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop',
    'steak': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'fish': 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop',
    'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    'dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'
  };
  
  const name = itemName.toLowerCase();
  for (const [key, image] of Object.entries(foodImages)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  // Default food image
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
};

function MenuItem({ item, onEdit, onDelete, onAddToCart, userId }) {
  return (
    <div className="menu-item">
      {item.image_url ? (
        <img 
          src={item.image_url} 
          alt={item.name}
          className="menu-item-image"
          onError={(e) => {
            e.target.src = getDefaultFoodImage(item.name);
          }}
        />
      ) : (
        <img 
          src={getDefaultFoodImage(item.name)}
          alt={item.name}
          className="menu-item-image"
        />
      )}
      
      <div className="menu-item-content">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p className="price">${item.price}</p>
        <p className="category">Category: {item.category?.name}</p>
        {!item.available && <span className="unavailable">Unavailable</span>}
        
        <div className="action-buttons">
          {item.available && onAddToCart && userId && (
            <button 
              className="btn btn-primary btn-small"
              onClick={() => onAddToCart(item.id)}
            >
              Add to Cart
            </button>
          )}
          
          {onEdit && (
            <button 
              className="btn btn-secondary btn-small"
              onClick={() => onEdit(item)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button 
              className="btn btn-danger btn-small"
              onClick={() => onDelete(item.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItem;