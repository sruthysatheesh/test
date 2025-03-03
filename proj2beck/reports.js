const express = require("express");
const mysql = require("mysql2");

const router = express.Router();
router.use(express.json());

// ✅ MySQL Database Connection
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
            (SELECT COUNT(*) FROM cases WHERE status = 'Pending') AS pendingCases,
            (SELECT COUNT(*) FROM cases WHERE status = 'Dismissed') AS dismissedCases;
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });

        res.json({ ...results[0], userActivity: [] });
    });
});

// ✅ Filter Cases & Get Statistics
router.post("/filter", (req, res) => {
    const { dateFrom, dateTo, status, judgeId, lawyerId } = req.body;

    let baseQuery = "FROM cases WHERE 1=1";
    let queryParams = [];

    if (dateFrom) {
        baseQuery += " AND DATE(created_at) >= ?";
        queryParams.push(dateFrom);
    }
    if (dateTo) {
        baseQuery += " AND DATE(created_at) <= ?";
        queryParams.push(dateTo);
    }
    if (status) {
        baseQuery += " AND status = ?";
        queryParams.push(status);
    }
    if (judgeId) {
        baseQuery += " AND judge_id = ?";
        queryParams.push(judgeId);
    }
    if (lawyerId) {
        baseQuery += " AND lawyer_id = ?";
        queryParams.push(lawyerId);
    }

    // ✅ Separate count queries to avoid SQL errors
    const casesQuery = `SELECT * ${baseQuery}`;
    
    const countQuery = `
        SELECT 
            COUNT(*) AS totalCases,
            SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS openCases,
            SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS closedCases,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pendingCases,
            SUM(CASE WHEN status = 'Dismissed' THEN 1 ELSE 0 END) AS dismissedCases
        ${baseQuery};
    `;

    db.query(casesQuery, queryParams, (err, casesResults) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });

        db.query(countQuery, queryParams, (err, countResults) => {
            if (err) return res.status(500).json({ error: "Database error", details: err.message });

            res.json({ ...countResults[0], filteredCases: casesResults });
        });
    });
});


// ✅ Fetch Admin Activity Log
router.get("/activity-log", (req, res) => {
    const query = "SELECT * FROM admin_activity_log ORDER BY timestamp DESC LIMIT 50";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.json({ userActivity: results });
    });
});

module.exports = router;
