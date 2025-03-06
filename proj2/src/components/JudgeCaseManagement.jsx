import React, { useState, useEffect } from "react";
import axios from "axios";

const JudgeCaseManagement = () => {

    const [cases, setCases] = useState([]);
const [judges, setJudges] = useState([]);
const [lawyers, setLawyers] = useState([]);

    useEffect(() => {
        fetchJudges();
        fetchLawyers();
        fetchCases();
    }, []);

    // ✅ Fetch Judges
    const fetchJudges = async () => {
        try {
            const judgeId = localStorage.getItem("judge_id"); // Store judge ID after login
            if (!judgeId) {
                console.warn("⚠ No Judge ID found.");
                return;
            }
            const response = await axios.get("http://localhost:5000/cases/judges/cases", {
                params: { judge_id: judgeId }
            });
            setJudges(response.data);
        } catch (error) {
            console.error("❌ Error fetching judge cases:", error.response?.data || error);
        }
    };
    

    // ✅ Fetch Lawyers
    const fetchLawyers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/lawyers/cases");
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

    return (
        <div>
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

export default JudgeCaseManagement;