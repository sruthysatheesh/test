const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
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

// ✅ Fetch Judges
router.get("/judges", (req, res) => {
    db.query("SELECT id, full_name FROM judges", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ✅ Fetch Lawyers
router.get("/lawyers", (req, res) => {
    db.query("SELECT id, full_name FROM lawyers", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ✅ Fetch Cases
router.get("/", (req, res) => {
    const sql = `
        SELECT c.case_id, c.case_title, c.status, c.case_actions, 
               j.full_name AS judge_name, 
               l.full_name AS lawyer_name
        FROM cases c
        LEFT JOIN judges j ON c.judge_id = j.id
        LEFT JOIN lawyers l ON c.lawyer_id = l.id
        ORDER BY c.created_at DESC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Database error fetching cases:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        if (results.length === 0) {
            console.warn("⚠ No cases found in the database!");
        }
        res.json(results);
    });
});
// ✅ Export router
module.exports = router;
