import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css"; // Import the CSS file

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", full_name: "" }); // Add full_name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Get JWT token
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
  const handleCreateUser = async (table) => {
    if (!newUser.username || !newUser.password) {
      setError("Username and password are required.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/users?table=${table}`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ username: "", password: "" });
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError("Error creating user. Please try again.");
      console.error("Error creating user:", err.response?.data || err.message);
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
    } catch (err) {
      setError("Error deleting user. Please try again.");
      console.error("Error deleting user:", err.response?.data || err.message);
    }
  };

  return (
    <div className="user-management">
      <h3 className="user-management-title">👥 User Management</h3>

      {/* 🔹 Error Display */}
      {error && <p className="error-message">{error}</p>}

      // 🔹 Create User Form
<div className="create-user-form">
    <input
        type="text"
        placeholder="Full Name"
        name="full_name"
        value={newUser.full_name}
        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
        className="form-input"
    />
    <input
        type="text"
        placeholder="Username"
        name="username"
        value={newUser.username}
        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        className="form-input"
    />
    <input
        type="password"
        placeholder="Password"
        name="password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        className="form-input"
    />
    <button onClick={() => handleCreateUser("judges")} className="form-button">
        Create Judge
    </button>
    <button onClick={() => handleCreateUser("lawyers")} className="form-button">
        Create Lawyer
    </button>
    <button onClick={() => handleCreateUser("clerk")} className="form-button">
        Create Clerk
    </button>
    <button onClick={() => handleCreateUser("admins")} className="form-button">
        Create Admin
    </button>
</div>

      {/* 🔹 Display User List */}
      {loading ? (
        <p className="loading-message">Loading users...</p>
      ) : (
        <ul className="user-list">
          {users.length === 0 ? (
            <p className="no-users-message">No users found.</p>
          ) : (
            users.map((user) => (
              <li key={user.id} className="user-item">
                <span className="user-info">
                  {user.username} <span className="user-role">({user.role})</span>
                </span>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;