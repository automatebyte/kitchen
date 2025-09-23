const API_BASE = '/api';

export const authService = {
  async login(credentials) {
    const response = await fetch(`${API_BASE}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  async register(userData) {
    const response = await fetch(`${API_BASE}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  async getUsers() {
    const response = await fetch(`${API_BASE}/users/`);
    return response.json();
  }
};