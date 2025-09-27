import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5555';

function UserProfile() {
  const [, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/`);
      const data = await response.json();
      setUsers(data);
      if (data.length > 0) setSelectedUser(data[0]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (!selectedUser) {
    return <div style={{ padding: '2rem' }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>User Profile</h2>
      <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
        <p><strong>Username:</strong> {selectedUser.username}</p>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Member since:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
        <p><strong>Total Orders:</strong> {selectedUser.orders ? selectedUser.orders.length : 0}</p>
      </div>
    </div>
  );
}

export default UserProfile;