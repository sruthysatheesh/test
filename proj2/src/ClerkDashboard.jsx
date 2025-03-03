import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserManagement from "./components/UserManagement";
import ReportsDashboard from "./components/ReportsDashboard";
import AdminProfile from "./components/AdminProfile";
import "./AdminDashboard.css"; // Import the CSS file

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Admin Dashboard</h1>
        <nav>
          <ul>
            <li><Link to="/admin-dashboard/users">User Management</Link></li>
            <li><Link to="/admin-dashboard/reports">Reports</Link></li>
            <li><Link to="/admin-dashboard/profile">Admin Profile</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;