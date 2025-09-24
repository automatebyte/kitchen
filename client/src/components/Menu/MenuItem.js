import React from 'react';

function MenuItem({ item }) {
  return (
    <div className="menu-item">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p className="price">${item.price}</p>
      <p className="category">Category: {item.category?.name}</p>
      {!item.available && <span className="unavailable">Unavailable</span>}
    </div>
  );
}

export default MenuItem;