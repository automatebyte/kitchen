const API_BASE_URL = '/api/menu';

export const getMenuItems = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch menu items');
  }
  return response.json();
};

export const createMenuItem = async (menuItemData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(menuItemData),
  });
  if (!response.ok) {
    throw new Error('Failed to create menu item');
  }
  return response.json();
};