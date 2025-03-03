import React, { useState, useEffect } from "react";
import axios from "axios";

const Judgments = () => {
  const [judgments, setJudgments] = useState([]);
  const [filters, setFilters] = useState({ caseId: "", date: "", status: "" });
  const [newJudgment, setNewJudgment] = useState({ caseId: "", summary: "", status: "" });

  useEffect(() => {
    fetchJudgments();
  }, []);

  const fetchJudgments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/judgments");
      setJudgments(res.data);
    } catch (err) {
      console.error("Error fetching judgments:", err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleNewJudgmentChange = (e) => {
    setNewJudgment({ ...newJudgment, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/judgments", { params: filters });
      setJudgments(res.data);
    } catch (err) {
      console.error("Error applying filters:", err);
    }
  };

  const addJudgment = async () => {
    try {
      await axios.post("http://localhost:5000/judgments", newJudgment);
      alert("Judgment added successfully!");
      fetchJudgments();
      setNewJudgment({ caseId: "", summary: "", status: "" });
    } catch (err) {
      console.error("Error adding judgment:", err);
    }
  };

  return (
    <div>
      <h2>📜 Judgments</h2>

      {/* Filters */}
      <div>
        <input type="text" name="caseId" placeholder="Case ID" onChange={handleFilterChange} />
        <input type="date" name="date" onChange={handleFilterChange} />
        <select name="status" onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="Finalized">Finalized</option>
          <option value="Pending">Pending</option>
        </select>
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      {/* Judgment List */}
      <ul>
        {judgments.map((judgment, index) => (
          <li key={index}>{judgment.caseId} - {judgment.summary} ({judgment.status})</li>
        ))}
      </ul>

      {/* Add Judgment */}
      <div>
        <h3>Add Judgment</h3>
        <input type="text" name="caseId" placeholder="Case ID" value={newJudgment.caseId} onChange={handleNewJudgmentChange} />
        <textarea name="summary" placeholder="Summary" value={newJudgment.summary} onChange={handleNewJudgmentChange}></textarea>
        <select name="status" value={newJudgment.status} onChange={handleNewJudgmentChange}>
          <option value="">Select Status</option>
          <option value="Finalized">Finalized</option>
          <option value="Pending">Pending</option>
        </select>
        <button onClick={addJudgment}>Add Judgment</button>
      </div>
    </div>
  );
};

export default Judgments;
