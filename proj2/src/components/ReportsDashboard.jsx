import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportsDashboard = () => {
  const [reports, setReports] = useState({
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
    pendingCases: 0,
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
    <div>
      <h2>📊 Reports & Analytics Dashboard</h2>

      {/* Case Statistics */}
      <div>
        <h3>Case Statistics</h3>
        <p>Total Cases: {reports.totalCases}</p>
        <p>Active Cases: {reports.activeCases}</p>
        <p>Completed Cases: {reports.completedCases}</p>
        <p>Pending Cases: {reports.pendingCases}</p>
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
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>

      {/* User Activity Log */}
      <div>
        <h3>Admin Activity Log</h3>
        <ul>
          {reports.userActivity.map((log, index) => (
            <li key={index}>{log.action} - {log.timestamp}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportsDashboard;
