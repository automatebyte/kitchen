import React from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';

function AdminPage() {
  // For demo purposes, using admin user ID 4. In a real app, get from auth context
  const userId = 4;
  const isAdmin = true;

  return (
    <div>
      <AdminDashboard userId={userId} isAdmin={isAdmin} />
    </div>
  );
}

export default AdminPage;