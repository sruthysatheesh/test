import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import JudgeCaseManagement from "./components/JudgeCaseManagement";
import CourtSessions from "./components/CourtSessions";
import Documents from "./components/Documents";
import "./AdminDashboard.css"; 

const LawyerDashboard = () => {
  return (
    <div className="lawyer-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Lawyer Dashboard</h1>
        <nav>
          <ul>
            <li><Link to="/lawyer-dashboard/cases">Case Management</Link></li>
            <li><Link to="/lawyer-dashboard/sessions">Court Sessions</Link></li>
            <li><Link to="/lawyer-dashboard/documents">Documents</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="cases" element={<JudgeCaseManagement />} />
          <Route path="sessions" element={<CourtSessions />} />
          <Route path="documents" element={<Documents />} />
        </Routes>
      </div>
    </div>
  );
};

export default LawyerDashboard;
