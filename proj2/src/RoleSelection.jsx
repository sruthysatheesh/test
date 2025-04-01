// Update your RoleSelection.jsx with these animation additions
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="role-selection-container">
      <header className="header">
        <h1 className="header-title animate-text-pop">JUDICIARY MANAGEMENT SYSTEM</h1>
        <p className="lines">------------------------------------------------------------------------------------------------------------</p>
        <p className="header-subtitle animate-text-fade">Streamlining Judicial Processes for Efficiency and Security</p>
        <p className="lines">------------------------------------------------------------------------------------------------------------</p>
      </header>

      <div className="role-cards">
        {[
          { role: 'clerk', icon: 'fa-gavel', title: 'Clerk', desc: 'Manage cases, upload documents and schedule hearings.' },
          { role: 'lawyer', icon: 'fa-balance-scale', title: 'Lawyer', desc: 'Access case files, submit documents, and manage client information.' },
          { role: 'judge', icon: 'fa-gavel', title: 'Judge', desc: 'Review cases, make rulings, and oversee court proceedings.' },
          { role: 'admin', icon: 'fa-user-shield', title: 'Admin', desc: 'Manage system users, roles, and permissions.' }
        ].map((item) => (
          <div
            key={item.role}
            className={`role-card ${item.role}`}
            onClick={() => handleRoleSelection(item.role)}
          >
            <div className="icon-circle">
              <div className="role-icon">
                <i className={`fas ${item.icon}`}></i>
              </div>
            </div>
            <h2 className="role-title animate-text-slide-up">{item.title}</h2>
            <p className="role-description animate-text-fade-in">{item.desc}</p>
          </div>
        ))}
      </div>

      <footer className="footer">
        <p className="footer-text animate-text-glow">© 2023 Judiciary System Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RoleSelection;