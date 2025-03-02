import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./RoleSelection";
import Login from "./Login";
import JudgeDashboard from "./JudgeDashboard";
import LawyerDashboard from "./LawyerDashboard";
import AdminDashboard from "./AdminDashboard";
import ClerkDashboard from "./ClerkDashboard"; // ✅ Added missing import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/judge-dashboard/*" element={<JudgeDashboard />} />
        <Route path="/lawyer-dashboard/*" element={<LawyerDashboard />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        <Route path="/clerk-dashboard/*" element={<ClerkDashboard />} /> {/* ✅ Now works correctly */}
      </Routes>
    </Router>
  );
};

export default App;
