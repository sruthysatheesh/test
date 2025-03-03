const express = require("express");
const mysql = require("mysql2");

const router = express.Router();
router.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "helloworld",
    database: "judicialsys",
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection error:", err);
    } else {
        console.log("✅ MySQL connected!");
    }
});

// ✅ Fetch General Reports Data
router.get("/", (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM cases) AS totalCases,
            (SELECT COUNT(*) FROM cases WHERE status = 'Open') AS openCases,
            (SELECT COUNT(*) FROM cases WHERE status = 'Closed') AS closedCases,
            (SELECT COUNT(*) FROM cases WHERE status = 'pending') AS pendingCases,
            (SELECT COUNT(*) FROM cases WHERE status = 'dismissed') AS dismissedCases;`

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });

        // Always return userActivity as an empty array
        res.json({ ...results[0], userActivity: [] });
    });
});


// ✅ Filter Cases Based on User Input
router.post("/filter", (req, res) => {
    const { dateFrom, dateTo, status, judgeId, lawyerId } = req.body;
    
    let query = "SELECT * FROM cases WHERE 1 = 1";
    let queryParams = [];
    
    if (dateFrom) {
        query += " AND DATE(created_at) >= ?";
    }
    if (dateTo) {
        query += " AND DATE(created_at) <= ?";
    }
    
    if (status) {
        query += " AND status = ?";
        queryParams.push(status);
    }
    if (judgeId) {
        query += " AND judge_id = ?";
        queryParams.push(judgeId);
    }
    if (lawyerId) {
        query += " AND lawyer_id = ?";
        queryParams.push(lawyerId);
    }
    
    db.query(query, queryParams, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.json(results);
    });
});

// ✅ Fetch Admin Activity Log
router.get("/activity-log", (req, res) => {
    const query = "SELECT * FROM admin_activity_log ORDER BY timestamp DESC LIMIT 50";
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.json(results);
    });
});

module.exports = router;
