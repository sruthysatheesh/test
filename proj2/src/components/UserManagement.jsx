import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "judge" });
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
  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ username: "", password: "", role: "judge" });
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

        <select name="role" value={newUser.role} 
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
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
                <button onClick={() => handleDeleteUser(user.id)}> Delete</button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;
