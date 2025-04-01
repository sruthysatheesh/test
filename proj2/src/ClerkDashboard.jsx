import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./AdminDashboard.css";

const ClerkDashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Case Management",
      description: "Manage all case files, update statuses, and track proceedings",
      path: "cases",  // Now relative path
      icon: "📂"
    },
    {
      title: "Court Sessions",
      description: "Schedule and manage upcoming court sessions and hearings",
      path: "sessions",  // Now relative path
      icon: "⚖️"
    },
    {
      title: "Reports Dashboard",
      description: "Generate and analyze court performance reports",
      path: "reports",  // Now relative path
      icon: "📊"
    },
    {
      title: "Document Center",
      description: "Upload, organize and manage legal documents",
      path: "documents",  // Now relative path
      icon: "📑"
    },
    {
      title: "My Profile",
      description: "Update your personal information and settings",
      path: "profile",  // Now relative path
      icon: "👤"
    }
  ];

  return (
    <div className="clerk-dashboard">
      <header className="dashboard-header">
        <h1 className="welcome-message">Clerk Portal</h1>
        <p className="welcome-subtext">Streamlining judicial administration</p>
      </header>

      <div className="dashboard-grid">
        {features.map((feature) => (
          <div 
            key={feature.path}
            className="feature-card"
            onClick={() => navigate(feature.path)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <div className="hover-indicator"></div>
          </div>
        ))}
      </div>

      <div className="main-content">
        <Outlet />
      </div>

      <footer className="dashboard-footer">
        <p>Judiciary System Management © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default ClerkDashboard;