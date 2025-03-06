const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const router = express.Router();
router.use(cors());
router.use(express.json());

// ✅ Database Connection
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "helloworld",
    database: "judicialsys",
    multipleStatements: true
});

// ✅ Fetch Judgments with Filters
router.get("/", (req, res) => {
    const { caseId, date, status } = req.query;

    let sql = `
        SELECT j.judgment_id, j.case_id, j.summary, j.status, j.created_at, 
               c.case_title 
        FROM judgments j
        JOIN cases c ON j.case_id = c.case_id
        WHERE 1 = 1
    `;

    const values = [];
    if (caseId) {
        sql += " AND j.case_id = ?";
        values.push(caseId);
    }
    if (date) {
        sql += " AND DATE(j.created_at) = ?";
        values.push(date);
    }
    if (status) {
        sql += " AND j.status = ?";
        values.push(status);
    }

    sql += " ORDER BY j.created_at DESC";

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error("❌ Database error fetching judgments:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.json(results);
    });
});

// ✅ Add a New Judgment
router.post("/", (req, res) => {
    const { caseId, summary, status } = req.body;

    if (!caseId || !summary || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `INSERT INTO judgments (case_id, summary, status, created_at) VALUES (?, ?, ?, NOW())`;

    db.query(sql, [caseId, summary, status], (err, result) => {
        if (err) {
            console.error("❌ Error inserting judgment:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.json({ message: "Judgment added successfully", judgment_id: result.insertId });
    });
});

// ✅ Export router
module.exports = router;
