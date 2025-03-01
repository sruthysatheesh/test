import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./RoleSelection";
import Login from "./Login";
import JudgeDashboard from "./JudgeDashboard";
import LawyerDashboard from "./LawyerDashboard";
import AdminDashboard from "./AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/judge-dashboard/*" element={<JudgeDashboard />} /> {/* ✅ Ensures Judge has sub-routes */}
        <Route path="/lawyer-dashboard/*" element={<LawyerDashboard />} /> {/* ✅ Ensures Lawyer has sub-routes */}
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} /> {/* ✅ More specific path */}
      </Routes>
    </Router>
  );
};

export default App;
