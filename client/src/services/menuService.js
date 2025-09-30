const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${BACKEND_URL}/api/menu`;

export const getMenuItems = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch menu items');
  }
  return response.json();
};

export const createMenuItem = async (menuItemData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BACKEND_URL}/api/admin/menu-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(menuItemData),
  });
  if (!response.ok) {
    throw new Error('Failed to create menu item');
  }
  return response.json();
};

export const updateMenuItem = async (id, menuItemData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BACKEND_URL}/api/admin/menu-items/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(menuItemData),
  });
  if (!response.ok) {
    throw new Error('Failed to update menu item');
  }
  return response.json();
};

export const deleteMenuItem = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BACKEND_URL}/api/admin/menu-items/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: JSON.parse(localStorage.getItem('user'))?.id }),
  });
  if (!response.ok) {
    throw new Error('Failed to delete menu item');
  }
  return response.ok;
};