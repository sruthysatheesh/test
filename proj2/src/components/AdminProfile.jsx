import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const adminId = localStorage.getItem("adminId"); // Store admin ID in localStorage after login

  useEffect(() => {
    fetchAdminProfile();
    fetchLoginHistory();
  }, []);

  // ✅ Fetch Admin Profile (Corrected API URL)
  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/admin/profile/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(res.data);
    } catch (err) {
      console.error("Error fetching admin profile:", err.response?.data || err.message);
    }
  };

  // ✅ Fetch Login History (Backend does not have this yet)
  const fetchLoginHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/admin/login-history/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoginHistory(res.data);
    } catch (err) {
      console.error("Error fetching login history:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Profile Change
  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  // ✅ Handle Password Change
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ Update Profile (Corrected API URL)
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId"); // Ensure this exists!
      if (!adminId) return alert("❌ Admin ID is missing!");
  
      const res = await axios.put(`http://localhost:5000/admin/profile/${adminId}`, admin, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("❌ Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };
  

  // ✅ Change Password (Corrected API URL)
  const changePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId"); // Ensure this exists!
      if (!adminId) return alert("❌ Admin ID is missing!");
  
      const res = await axios.put(`http://localhost:5000/admin/password/${adminId}`, passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("✅ Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Error changing password:", err.response?.data || err.message);
      alert("❌ Failed to change password: " + (err.response?.data?.message || err.message));
    }
  };
  

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    navigate("/");
  };

  return (
    <div>
      <h2>👤 Admin Profile</h2>

      {/* Profile Update */}
      <div>
        <h3>Update Profile</h3>
        <label>Username:</label>
        <input type="text" name="username" value={admin.username} onChange={handleChange} placeholder="Username" />
        
        <label>Email:</label>
        <input type="email" name="email" value={admin.email} onChange={handleChange} placeholder="Email" />
        
        <button onClick={updateProfile}>Update Profile</button>
      </div>

      {/* Change Password */}
      <div>
        <h3>Change Password</h3>
        <label>Old Password:</label>
        <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordChange} placeholder="Old Password" />
        
        <label>New Password:</label>
        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="New Password" />
        
        <button onClick={changePassword}>Change Password</button>
      </div>

      {/* Login History */}
      <div>
        <h3>📜 Login History</h3>
        {loading ? <p>Loading...</p> : (
          <ul>
            {loginHistory.length === 0 ? (
              <p>No login history found.</p>
            ) : (
              loginHistory.map((log, index) => (
                <li key={index}>{log.timestamp} - {log.ip}</li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} style={{ background: "red", color: "white", marginTop: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default AdminProfile;
