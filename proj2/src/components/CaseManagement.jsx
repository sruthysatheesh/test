import React, { useState, useEffect } from "react";
import axios from "axios";

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
        if (!newCaseTitle || !selectedJudgeId || !selectedLawyerId || !newCaseActions || caseDocuments.length === 0) {
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
        <div>
            <h2>Case Management</h2>
            <div>
                <h3>Add Case</h3>
                <input type="text" placeholder="Enter Case Title" value={newCaseTitle} onChange={(e) => setNewCaseTitle(e.target.value)} />
                <select value={newCaseStatus} onChange={(e) => setNewCaseStatus(e.target.value)}>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Pending">Pending</option>
                    <option value="Dismissed">Dismissed</option>
                </select>

                <select value={selectedJudgeId} onChange={(e) => setSelectedJudgeId(e.target.value)}>
                    <option value="">Select Judge</option>
                    {judges.map((judge) => (
                        <option key={judge.id} value={judge.id}>{judge.full_name || judge.username}</option>
                    ))}
                </select>

                <select value={selectedLawyerId} onChange={(e) => setSelectedLawyerId(e.target.value)}>
                    <option value="">Select Lawyer</option>
                    {lawyers.map((lawyer) => (
                        <option key={lawyer.id} value={lawyer.id}>{lawyer.full_name || lawyer.username}</option>
                    ))}
                </select>

                <input type="text" placeholder="Enter Case Actions" value={newCaseActions} onChange={(e) => setNewCaseActions(e.target.value)} />
                <input type="file" multiple onChange={handleFileChange} />
                <button onClick={handleAddCase}>Add Case</button>
            </div>

            <h3>Cases List</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Judge</th>
                        <th>Lawyer</th>
                        <th>Case Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.length === 0 ? (
                        <tr><td colSpan="6">⚠ No Cases Found</td></tr>
                    ) : (
                        cases.map((caseItem, index) => (
                            <tr key={index}>
                                <td>{caseItem.case_id}</td>
                                <td>{caseItem.case_title}</td>
                                <td>{caseItem.status}</td>
                                <td>{caseItem.judge_name || "⚠ No Judge Assigned"}</td>
                                <td>{caseItem.lawyer_name || "⚠ No Lawyer Assigned"}</td>
                                <td>{caseItem.case_actions}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CaseManagement;
