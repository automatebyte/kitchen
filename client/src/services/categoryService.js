const API_BASE_URL = '/api/categories';

export const getCategories = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const createCategory = async (categoryData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error('Failed to create category');
  }
  return response.json();
};