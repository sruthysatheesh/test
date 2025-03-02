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

    // Fetch Judges with Debugging
    const fetchJudges = async () => {
        try {
            const response = await axios.get("http://localhost:5000/cases/judges");
            console.log("✅ Judges Data:", response.data); // Debugging log
            if (!response.data.length) {
                console.warn("⚠ No judges returned from API!");
            }
            setJudges(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch judges:", error);
        }
    };

    // Fetch Lawyers with Debugging
    const fetchLawyers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/cases/lawyers");
            console.log("✅ Lawyers Data:", response.data); // Debugging log
            if (!response.data.length) {
                console.warn("⚠ No lawyers returned from API!");
            }
            setLawyers(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch lawyers:", error);
        }
    };

    // Fetch Cases with Debugging
    const fetchCases = async () => {
        try {
            const response = await axios.get("http://localhost:5000/cases");
            console.log("✅ Cases Data:", response.data); // Debugging log
            setCases(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch cases:", error);
        }
    };

    const handleFileChange = (e) => {
        setCaseDocuments([...e.target.files]);
    };

    const handleAddCase = async () => {
        if (!newCaseTitle || !newCaseStatus || !selectedJudgeId || !selectedLawyerId || !newCaseActions || caseDocuments.length === 0) {
            alert("All fields are required, including at least one document!");
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
            await axios.post("http://localhost:5001/cases", formData, {
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
            console.error("❌ Error adding case:", err);
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

                {/* ✅ Debugging for Judges Dropdown */}
                <select value={selectedJudgeId} onChange={(e) => setSelectedJudgeId(e.target.value)}>
                    <option value="">Select Judge</option>
                    {judges.length === 0 && <option disabled>⚠ No judges available</option>}
                    {judges.map((judge) => (
                        <option key={judge.id} value={judge.id}>{judge.username || judge.full_name}</option>
                    ))}
                </select>

                {/* ✅ Debugging for Lawyers Dropdown */}
                <select value={selectedLawyerId} onChange={(e) => setSelectedLawyerId(e.target.value)}>
                    <option value="">Select Lawyer</option>
                    {lawyers.length === 0 && <option disabled>⚠ No lawyers available</option>}
                    {lawyers.map((lawyer) => (
                        <option key={lawyer.id} value={lawyer.id}>{lawyer.username || lawyer.full_name}</option>
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
                        <th>Documents</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((caseItem) => (
                        <tr key={caseItem.case_id}>
                            <td>{caseItem.case_id}</td>
                            <td>{caseItem.case_title}</td>
                            <td>{caseItem.status}</td>
                            <td>{caseItem.judge_name || "⚠ No Judge Assigned"}</td>
                            <td>{caseItem.lawyer_name || "⚠ No Lawyer Assigned"}</td>
                            <td>{caseItem.case_actions}</td>
                            <td>
                                {caseItem.documents?.length > 0 ? (
                                    caseItem.documents.map((doc, index) => (
                                        <div key={index}>
                                            <a href={doc} target="_blank" rel="noopener noreferrer">Download {index + 1}</a>
                                        </div>
                                    ))
                                ) : (
                                    "⚠ No Documents"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CaseManagement;
