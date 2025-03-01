import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css'; // Import the updated CSS file

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="role-selection-container">
      {/* Header Section */}
      <header className="header">
        <h1 className="header-title">Judiciary System Management</h1>
        <p className="header-subtitle">Streamlining Judicial Processes for Efficiency and Security</p>
      </header>

      {/* Role Cards Section */}
      <div className="role-cards">
        <div
          className="role-card lawyer"
          onClick={() => handleRoleSelection('lawyer')}
        >
          <div className="role-icon">
            <i className="fas fa-balance-scale"></i>
          </div>
          <h2 className="role-title">Lawyer</h2>
          <p className="role-description">Access case files, submit documents, and manage client information.</p>
        </div>

        <div
          className="role-card judge"
          onClick={() => handleRoleSelection('judge')}
        >
          <div className="role-icon">
            <i className="fas fa-gavel"></i>
          </div>
          <h2 className="role-title">Judge</h2>
          <p className="role-description">Review cases, make rulings, and oversee court proceedings.</p>
        </div>

        <div
          className="role-card admin"
          onClick={() => handleRoleSelection('admin')}
        >
          <div className="role-icon">
            <i className="fas fa-user-shield"></i>
          </div>
          <h2 className="role-title">Admin</h2>
          <p className="role-description">Manage system users, roles, and permissions.</p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p className="footer-text">© 2023 Judiciary System Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RoleSelection;