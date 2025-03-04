import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CaseManagement from "./components/CaseManagement";
import CourtSessions from "./components/CourtSessions";
import ReportsDashboard from "./components/ReportsDashboard";
import Documents from "./components/Documents";
import ClerkProfile from './components/ClerkProfile';
import Notifications from "./components/Notifications";
import "./AdminDashboard.css"; // ✅ Changed the CSS filename for clarity

const ClerkDashboard = () => {
  return (
    <div className="clerk-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Clerk Dashboard</h1> {/* ✅ Fixed the title */}
        <nav>
          <ul>
            <li><Link to="/clerk-dashboard/cases">Case Management</Link></li> {/* ✅ Fixed URL path */}
            <li><Link to="/clerk-dashboard/sessions">Court Sessions</Link></li>
            <li><Link to="/clerk-dashboard/reports">Reports</Link></li>
            <li><Link to="/clerk-dashboard/documents">Documents</Link></li>
            <li><Link to="/clerk-dashboard/notifications">Notifications</Link></li>
            <li><Link to="/clerk-dashboard/profile">Profile</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="cases" element={<CaseManagement />} />
          <Route path="sessions/*" element={<CourtSessions />} >
            <Route path="cases" element={<CaseManagement />} />
          </Route>
          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<ClerkProfile />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default ClerkDashboard;
