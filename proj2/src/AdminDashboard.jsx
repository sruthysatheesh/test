import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserManagement from "./components/UserManagement";
import CaseManagement from "./components/CaseManagement";
import CourtSessions from "./components/CourtSessions";
import ReportsDashboard from "./components/ReportsDashboard";
import Documents from "./components/Documents";
import Notifications from "./components/Notifications";
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
            <li><Link to="/admin-dashboard/cases">Case Management</Link></li>
            <li><Link to="/admin-dashboard/sessions">Court Sessions</Link></li>
            <li><Link to="/admin-dashboard/reports">Reports</Link></li>
            <li><Link to="/admin-dashboard/documents">Documents</Link></li>
            <li><Link to="/admin-dashboard/notifications">Notifications</Link></li>
            <li><Link to="/admin-dashboard/profile">Admin Profile</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="cases" element={<CaseManagement />} />
          <Route path="sessions/*" element={<CourtSessions />} >
            <Route path="cases" element={<CaseManagement />} />
          </Route>
          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;