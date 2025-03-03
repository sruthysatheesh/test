import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportsDashboard = () => {
  const [reports, setReports] = useState({
    totalCases: 0,
    openCases: 0,
    closedCases: 0,
    pendingCases: 0,
    dismissedCases: 0,
    userActivity: [], // Ensure this is always an array
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
    <div>
      <h2>📊 Reports & Analytics Dashboard</h2>

      {/* Case Statistics */}
      <div>
        <h3>Case Statistics</h3>
        <p>Total Cases: {reports.totalCases}</p>
        <p>Open Cases: {reports.openCases}</p>
        <p>Closed Cases: {reports.closedCases}</p>
        <p>Pending Cases: {reports.pendingCases}</p>
        <p>Dismissed Cases: {reports.dismissedCases}</p>
      </div>

      {/* Filters for Reports */}
      <div>
        <h3>Generate Reports</h3>
        <label>From:</label>
        <input type="date" name="dateFrom" value={filter.dateFrom} onChange={handleFilterChange} />

        <label>To:</label>
        <input type="date" name="dateTo" value={filter.dateTo} onChange={handleFilterChange} />

        <label>Status:</label>
        <select name="status" value={filter.status} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="active">Open</option>
          <option value="completed">Closed</option>
          <option value="pending">Pending</option>
          <option value="pending">Dismissed</option>
        </select>

        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>

      {/* User Activity Log */}
      <div>
        <h3>Admin Activity Log</h3>
        <ul>
        {Array.isArray(reports.userActivity) && reports.userActivity.length > 0 ? (
            reports.userActivity.map((log, index) => (
              <li key={index}>{log.action} - {log.timestamp}</li>
            ))
          ) : (
            <p>No admin activity logs available.</p>
          )}

        </ul>
      </div>
    </div>
  );
};

export default ReportsDashboard;
