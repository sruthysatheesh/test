import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CaseManagement from "./components/CaseManagement";
import CourtSessions from "./components/CourtSessions";
import Judgments from "./components/Judgments";
import Documents from "./components/Documents";
import Notifications from "./components/Notifications";
import "./AdminDashboard.css"; // CSS for styling

const JudgeDashboard = () => {
  return (
    <div className="judge-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Judge Dashboard</h1>
        <nav>
          <ul>
            <li><Link to="/judge-dashboard/cases">Case Management</Link></li>
            <li><Link to="/judge-dashboard/sessions">Court Sessions</Link></li>
            <li><Link to="/judge-dashboard/judgments">Judgments</Link></li>
            <li><Link to="/judge-dashboard/documents">Documents</Link></li>
            <li><Link to="/judge-dashboard/notifications">Notifications</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route path="cases" element={<CaseManagement />} />
          <Route path="sessions" element={<CourtSessions />} />
          <Route path="judgments" element={<Judgments />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default JudgeDashboard;
