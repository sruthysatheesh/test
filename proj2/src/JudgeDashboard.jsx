import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import JudgeCaseManagement from "./components/JudgeCaseManagement";
import CourtSessions from "./components/CourtSessions";
import Judgments from "./components/Judgments";
import Documents from "./components/Documents";
import JudgeProfile from "./components/JudgeProfile";
import "./AdminDashboard.css"; // Updated CSS

const JudgeDashboard = () => {
  return (
    <div className="judge-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Judge Dashboard</h1>
        <nav>
          <ul>
            <li><Link to="/judge-dashboard/cases/judges/cases">Case Management</Link></li>
            <li><Link to="/judge-dashboard/sessions">Court Sessions</Link></li>
            <li><Link to="/judge-dashboard/judgments">Judgments</Link></li>
            <li><Link to="/judge-dashboard/documents">Documents</Link></li>
            <li><Link to="/judge-dashboard/profile">Profile</Link></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Welcome Message */}
        <div className="welcome-message">
          <h2>Welcome, Judge</h2>
          <p>
            As a presiding judge, you have access to case management, court sessions, judgments, and legal documents.  
            This dashboard is designed to streamline your workflow, ensuring efficient case handling and judicial oversight.  
            Please use the navigation on the left to manage your duties effectively.
          </p>
        </div>

        <Routes>
          <Route path="cases/judges/cases" element={<JudgeCaseManagement />} />
          <Route path="sessions" element={<CourtSessions />} />
          <Route path="judgments" element={<Judgments />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<JudgeProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default JudgeDashboard;
