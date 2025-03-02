import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user-management.css";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", email: "", full_name:"", phone:"", role: "judge" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user details

  // 🔹 Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Error fetching users. Please try again.");
      console.error("Error fetching users:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Handle Create User
  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setNewUser({ username: "", password: "", email: "", full_name: "", phone: "", role: "judge" });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError(err.response?.data?.message || "Error creating user. Please try again.");
    }
  };

  // 🔹 Handle Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh user list
      if (selectedUser?.id === id) setSelectedUser(null); // Clear selected user if deleted
    } catch (err) {
      setError("Error deleting user. Please try again.");
      console.error("Error deleting user:", err.response?.data || err.message);
    }
  };

  // 🔹 Handle View User
  const handleViewUser = (id) => {
    const user = users.find((u) => u.id === id);
    setSelectedUser(user || null); // Set selected user for display
  };

  return (
    <div>
      <h3>👥 User Management</h3>

      {/* 🔹 Error Display */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔹 Create User Form */}
      <div>
        <input type="text" placeholder="Username" name="username" 
          value={newUser.username} 
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />

        <input type="password" placeholder="Password" name="password" 
          value={newUser.password} 
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />

        <input type="text" placeholder="Email" name="email" 
          value={newUser.email} 
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          
        <input type="text" placeholder="Full Name" name="full_name" 
          value={newUser.full_name} 
          onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} />

        <input type="text" placeholder="Phone" name="phone" 
          value={newUser.phone} 
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />

        <select name="role" value={newUser.role} 
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
          <option value="clerk">Clerk</option>
          <option value="judge">Judge</option>
          <option value="lawyer">Lawyer</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleCreateUser}>Create User</button>
      </div>

      {/* 🔹 Display User List */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => (
              <li key={user.id}>
                {user.username} ({user.role}) 
                <button onClick={() => handleViewUser(user.id)}>View</button>
              </li>
            ))
          )}
        </ul>
      )}

      {/* 🔹 Display Selected User Details */}
      {selectedUser && (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
          <h4>📌 User Details</h4>
          <p><strong>👤 Username:</strong> {selectedUser.username}</p>
          <p><strong>📧 Email:</strong> {selectedUser.email}</p>
          <p><strong>🏷 Full Name:</strong> {selectedUser.full_name}</p>
          <p><strong>📞 Phone:</strong> {selectedUser.phone}</p>
          <p><strong>🏛 Role:</strong> {selectedUser.role}</p>
          <button onClick={() => setSelectedUser(null)}>Close</button>
          <button onClick={() => handleDeleteUser(selectedUser.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
