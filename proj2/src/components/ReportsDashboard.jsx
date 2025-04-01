import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReportsDashboard.css";

const ReportsDashboard = () => {
  const [reports, setReports] = useState({
    totalCases: 0,
    openCases: 0,
    closedCases: 0,
    pendingCases: 0,
    dismissedCases: 0,
    userActivity: [],
  });

  const [filter, setFilter] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    judgeId: "",
    lawyerId: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = async () => {
    try {
      const res = await axios.post("http://localhost:5000/reports/filter", filter);
      setReports(res.data);
    } catch (err) {
      console.error("Error generating report:", err);
    }
  };

  return (
    <div className="reports-dashboard">
      <div className="floating-shapes">
        <div></div>
        <div></div>
      </div>
      
      <h2>📊 Reports & Analytics Dashboard</h2>

      {/* Case Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{reports.totalCases}</div>
          <div className="stat-label">Total Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{reports.openCases}</div>
          <div className="stat-label">Open Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{reports.closedCases}</div>
          <div className="stat-label">Closed Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{reports.pendingCases}</div>
          <div className="stat-label">Pending Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{reports.dismissedCases}</div>
          <div className="stat-label">Dismissed Cases</div>
        </div>
      </div>

      {/* Filters for Reports */}
      <div className="filter-section">
        <h3>Generate Custom Report</h3>
        <div className="filter-grid">
          <div className="filter-group">
            <label>From Date</label>
            <input 
              type="date" 
              className="filter-control" 
              name="dateFrom" 
              value={filter.dateFrom} 
              onChange={handleFilterChange} 
            />
          </div>
          <div className="filter-group">
            <label>To Date</label>
            <input 
              type="date" 
              className="filter-control" 
              name="dateTo" 
              value={filter.dateTo} 
              onChange={handleFilterChange} 
            />
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select 
              className="filter-control" 
              name="status" 
              value={filter.status} 
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Pending">Pending</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>
        <button className="generate-btn" onClick={handleGenerateReport}>
          Generate Report
        </button>
      </div>

      {/* User Activity Log */}
      <div className="activity-log">
        <h3>Admin Activity Log</h3>
        {Array.isArray(reports.userActivity) && reports.userActivity.length > 0 ? (
          <ul className="log-list">
            {reports.userActivity.map((log, index) => (
              <li className="log-item" key={index}>
                <span className="log-action">{log.action}</span>
                <span className="log-timestamp">{log.timestamp}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No admin activity logs available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;