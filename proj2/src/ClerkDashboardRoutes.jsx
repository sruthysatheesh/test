import React from "react";
import { Routes, Route } from "react-router-dom";
import ClerkDashboard from "./ClerkDashboard";
import CaseManagement from "./components/CaseManagement";
import CourtSessions from "./components/CourtSessions";
import ReportsDashboard from "./components/ReportsDashboard";
import Documents from "./components/Documents";
import ClerkProfile from './components/ClerkProfile';

const DefaultClerkContent = () => (
  <div className="welcome-default">
    <h2>Welcome to Clerk Dashboard</h2>
    <p>Select a function from the cards above</p>
  </div>
);

const ClerkDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ClerkDashboard />}>
        <Route index element={<DefaultClerkContent />} />
        <Route path="cases" element={<CaseManagement />} />
        <Route path="sessions" element={<CourtSessions />} />
        <Route path="reports" element={<ReportsDashboard />} />
        <Route path="documents" element={<Documents />} />
        <Route path="profile" element={<ClerkProfile />} />
      </Route>
    </Routes>
  );
};

export default ClerkDashboardRoutes;