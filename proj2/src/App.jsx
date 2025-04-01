import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./RoleSelection";
import Login from "./Login";
import JudgeDashboard from "./JudgeDashboard";
import LawyerDashboard from "./LawyerDashboard";
import AdminDashboard from "./AdminDashboard";
import ClerkDashboardRoutes from "./ClerkDashboardRoutes"; // Changed to use ClerkDashboardRoutes

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/judge-dashboard/*" element={<JudgeDashboard />} />
        <Route path="/lawyer-dashboard/*" element={<LawyerDashboard />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/clerk-dashboard/*" element={<ClerkDashboardRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;