import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClerkProfile = () => {
  const [clerk, setClerk] = useState({ username: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clerkId = localStorage.getItem("clerkId"); // Clerk ID stored after login

  useEffect(() => {
    fetchClerkProfile();
    fetchLoginHistory();
  }, []);

  // ✅ Fetch Clerk Profile (Fixed API)
  const fetchClerkProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/clerk/profile/${clerkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClerk(res.data);
    } catch (err) {
      console.error("Error fetching clerk profile:", err.response?.data || err.message);
    }
  };

  // ✅ Fetch Login History (Fixed API)
  const fetchLoginHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/clerk/login-history/${clerkId}`, {
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
    setClerk({ ...clerk, [e.target.name]: e.target.value });
  };

  // ✅ Handle Password Change
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ Update Clerk Profile (Fixed API)
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!clerkId) return alert("❌ Clerk ID is missing!");

      await axios.put(`http://localhost:5000/clerk/profile/${clerkId}`, clerk, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("❌ Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  // ✅ Change Password (Fixed API)
  const changePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!clerkId) return alert("❌ Clerk ID is missing!");

      await axios.put(`http://localhost:5000/clerk/password/${clerkId}`, passwords, {
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
    localStorage.removeItem("clerkId");
    navigate("/");
  };

  return (
    <div>
      <h2>👤 Clerk Profile</h2>

      {/* Profile Update */}
      <div>
        <h3>Update Profile</h3>
        <label>Username:</label>
        <input type="text" name="username" value={clerk.username} onChange={handleChange} placeholder="Username" />
        
        <label>Email:</label>
        <input type="email" name="email" value={clerk.email} onChange={handleChange} placeholder="Email" />
        
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

export default ClerkProfile;
