const API_BASE = '/api';

export const orderService = {
  async getOrders() {
    const response = await fetch(`${API_BASE}/orders/`);
    return response.json();
  },

  async createOrder(orderData) {
    const response = await fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  }
};