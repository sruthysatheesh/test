import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CourtSessions.css"; // Assuming you have a CSS file for styling

const CourtSessions = () => {
    const [hearings, setHearings] = useState([]);
    const [cases, setCases] = useState([]);
    const [judges, setJudges] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newCase, setNewCase] = useState({
        case_title: "",
        judge_id: "",
    });

    useEffect(() => {
        fetchHearings();
        fetchCases();
        fetchJudges();
    }, []);

    // ✅ Fetch Hearings
    const fetchHearings = async () => {
        try {
            const response = await axios.get("http://localhost:5002/hearings");
            setHearings(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch hearings:", error);
        }
    };

    // ✅ Fetch Cases
    const fetchCases = async () => {
        try {
            const response = await axios.get("http://localhost:5002/cases");
            setCases(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch cases:", error);
        }
    };

    // ✅ Fetch Judges
    const fetchJudges = async () => {
        try {
            const response = await axios.get("http://localhost:5002/judges");
            setJudges(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch judges:", error);
        }
    };

    // ✅ Add Case (Automatically Schedules Hearing)
    const handleAddCase = async () => {
        if (!newCase.case_title.trim() || !newCase.judge_id) {
            alert("❌ All fields are required!");
            return;
        }

        try {
            await axios.post("http://localhost:5002/cases", newCase);
            alert("✅ Case added and hearing scheduled!");
            setNewCase({ case_title: "", judge_id: "" });
            fetchCases();
            fetchHearings();
        } catch (error) {
            console.error("❌ Error adding case:", error.response?.data || error.message);
        }
    };

    // ✅ Edit Hearing Date & Status
    const handleEditHearing = async (hearing_id, hearing_date, status) => {
        try {
            await axios.put(`http://localhost:5002/hearings/${hearing_id}`, {
                hearing_date,
                status,
            });
            alert("✅ Hearing updated!");
            fetchHearings();
        } catch (error) {
            console.error("❌ Error updating hearing:", error);
        }
    };

    // ✅ Close Case
    const handleCloseCase = async (caseId) => {
      try {
          const response = await fetch(`http://localhost:5002/cases/${caseId}/close`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
          });
  
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText);
          }
  
          console.log("✅ Case closed successfully");
      } catch (error) {
          console.error("❌ Error closing case:", error.message);
      }
  };
  
  

  return (
    <div className="court-sessions">
        <div className="floating-shapes">
            <div></div>
            <div></div>
        </div>
        
        <h2>Manage Court Cases & Hearings</h2>
        
        <div className="search-bar">
            <input
                type="text"
                className="search-input"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="add-case-form">
            <h3>Add New Case</h3>
            <div className="form-grid">
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Case Title"
                        value={newCase.case_title}
                        onChange={(e) => setNewCase({ ...newCase, case_title: e.target.value })}
                    />
                </div>
                
                <div className="form-group">
                    <select
                        className="form-control"
                        value={newCase.judge_id}
                        onChange={(e) => setNewCase({ ...newCase, judge_id: e.target.value })}
                    >
                        <option value="">Select Judge</option>
                        {judges.map((j) => (
                            <option key={j.id} value={j.id}>{j.username}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <button className="btn btn-primary" onClick={handleAddCase}>
                Add Case & Schedule Hearing
            </button>
        </div>
        
        <div className="cases-table-container">
            <h3>Cases</h3>
            {cases.length === 0 ? (
                <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No cases found. Add your first case above.</p>
                </div>
            ) : (
                <table className="session-table">
                    <thead>
                        <tr>
                            <th>Case Title</th>
                            <th>Judge</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases
                            .filter((c) => c.case_title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((c) => (
                                <tr key={c.case_id}>
                                    <td>{c.case_title}</td>
                                    <td>{c.judge_name}</td>
                                    <td>
                                        <span className={`status-badge status-${c.status.toLowerCase()}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        {c.status !== "Closed" && (
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleCloseCase(c.case_id)}
                                            >
                                                Close Case
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
        
        <div className="hearings-table-container">
            <h3>Scheduled Hearings</h3>
            {hearings.length === 0 ? (
                <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No hearings scheduled yet.</p>
                </div>
            ) : (
                <table className="session-table">
                    <thead>
                        <tr>
                            <th>Case Title</th>
                            <th>Judge</th>
                            <th>Hearing Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hearings.map((hearing) => (
                            <tr key={hearing.hearing_id}>
                                <td>{hearing.case_title}</td>
                                <td>{hearing.judge_name}</td>
                                <td>
                                    <input
                                        type="datetime-local"
                                        className="date-input"
                                        value={new Date(hearing.hearing_date).toISOString().slice(0, 16)}
                                        onChange={(e) => handleEditHearing(hearing.hearing_id, e.target.value, hearing.status)}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="form-control"
                                        value={hearing.status}
                                        onChange={(e) => handleEditHearing(hearing.hearing_id, hearing.hearing_date, e.target.value)}
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);
};

export default CourtSessions;
