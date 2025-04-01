import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CaseManagement.css"; // Assuming you have a CSS file for styling

const CaseManagement = () => {
    const [newCaseTitle, setNewCaseTitle] = useState("");
    const [newCaseStatus, setNewCaseStatus] = useState("Open");
    const [newCaseActions, setNewCaseActions] = useState("");
    const [selectedJudgeId, setSelectedJudgeId] = useState("");
    const [selectedLawyerId, setSelectedLawyerId] = useState("");
    const [caseDocuments, setCaseDocuments] = useState([]);
    const [judges, setJudges] = useState([]);
    const [lawyers, setLawyers] = useState([]);
    const [cases, setCases] = useState([]);

    useEffect(() => {
        fetchJudges();
        fetchLawyers();
        fetchCases();
    }, []);

    // ✅ Fetch Judges
    const fetchJudges = async () => {
        try {
            const response = await axios.get("http://localhost:5000/cases/judges");
            setJudges(response.data);
        } catch (error) {
            console.error("❌ Error fetching judges:", error.response?.data || error);
        }
    };

    // ✅ Fetch Lawyers
    const fetchLawyers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/cases/lawyers");
            setLawyers(response.data);
        } catch (error) {
            console.error("❌ Error fetching lawyers:", error.response?.data || error);
        }
    };

    // ✅ Fetch Cases
    const fetchCases = async () => {
        try {
            const response = await axios.get("http://localhost:5000/cases");
            console.log("✅ Cases Data Received:", response.data); // Debug log
            setCases(response.data);
        } catch (error) {
            console.error("❌ Error fetching cases:", error.response?.data || error);
            alert("Error fetching cases. Check API connection.");
        }
    };

    // ✅ Handle File Selection
    const handleFileChange = (e) => {
        setCaseDocuments([...e.target.files]);
    };

    // ✅ Add Case
    const handleAddCase = async () => {
        if (!newCaseTitle || !selectedJudgeId || !selectedLawyerId || !newCaseActions === 0) {
            alert("❌ All fields are required!");
            return;
        }

        const formData = new FormData();
        formData.append("case_title", newCaseTitle);
        formData.append("status", newCaseStatus);
        formData.append("judge_id", selectedJudgeId);
        formData.append("lawyer_id", selectedLawyerId);
        formData.append("case_actions", newCaseActions);
        caseDocuments.forEach((doc) => formData.append("documents", doc));

        try {
            await axios.post("http://localhost:5000/cases", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("✅ Case added successfully!");
            setNewCaseTitle("");
            setNewCaseActions("");
            setSelectedJudgeId("");
            setSelectedLawyerId("");
            setCaseDocuments([]);
            fetchCases();
        } catch (err) {
            console.error("❌ Error adding case:", err.response?.data || err);
        }
    };

    return (
        <div className="case-management">
            <div className="floating-shapes">
                <div></div>
                <div></div>
            </div>
            
            <h2>Case Management</h2>
            
            <div className="add-case-form">
                <h3>Add New Case</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Case Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter Case Title" 
                            value={newCaseTitle} 
                            onChange={(e) => setNewCaseTitle(e.target.value)} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Status</label>
                        <select 
                            className="form-control" 
                            value={newCaseStatus} 
                            onChange={(e) => setNewCaseStatus(e.target.value)}
                        >
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                            <option value="Pending">Pending</option>
                            <option value="Dismissed">Dismissed</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Assigned Judge</label>
                        <select 
                            className="form-control" 
                            value={selectedJudgeId} 
                            onChange={(e) => setSelectedJudgeId(e.target.value)}
                        >
                            <option value="">Select Judge</option>
                            {judges.map((judge) => (
                                <option key={judge.id} value={judge.id}>
                                    {judge.full_name || judge.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Assigned Lawyer</label>
                        <select 
                            className="form-control" 
                            value={selectedLawyerId} 
                            onChange={(e) => setSelectedLawyerId(e.target.value)}
                        >
                            <option value="">Select Lawyer</option>
                            {lawyers.map((lawyer) => (
                                <option key={lawyer.id} value={lawyer.id}>
                                    {lawyer.full_name || lawyer.username}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Case Actions</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Case Actions" 
                        value={newCaseActions} 
                        onChange={(e) => setNewCaseActions(e.target.value)} 
                    />
                </div>
                
                <div className="form-group">
                    <div className="file-upload">
                        <label className="file-upload-label">
                            {caseDocuments.length > 0 
                                ? `${caseDocuments.length} file(s) selected` 
                                : "Drag & drop files or click to browse"}
                            <input 
                                type="file" 
                                className="file-upload-input" 
                                multiple 
                                onChange={handleFileChange} 
                            />
                        </label>
                    </div>
                </div>
                
                <button className="submit-btn" onClick={handleAddCase}>
                    Add Case
                </button>
            </div>
            
            <div className="cases-table-container">
                <h3>Cases List</h3>
                {cases.length === 0 ? (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No cases found. Add your first case above.</p>
                    </div>
                ) : (
                    <table className="cases-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Judge</th>
                                <th>Lawyer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((caseItem) => (
                                <tr key={caseItem.case_id}>
                                    <td>{caseItem.case_id}</td>
                                    <td>{caseItem.case_title}</td>
                                    <td>
                                        <span className={`status-badge status-${caseItem.status.toLowerCase()}`}>
                                            {caseItem.status}
                                        </span>
                                    </td>
                                    <td>{caseItem.judge_name || "Not assigned"}</td>
                                    <td>{caseItem.lawyer_name || "Not assigned"}</td>
                                    <td>{caseItem.case_actions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CaseManagement;