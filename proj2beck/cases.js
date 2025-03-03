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

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in an 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

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
        res.json(results);
    });
});

// ✅ Add Case (Handles File Uploads)
router.post("/", upload.array("documents"), (req, res) => {
    const { case_title, status, judge_id, lawyer_id, case_actions } = req.body;

    if (!case_title || !status || !judge_id || !lawyer_id || !case_actions) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `
        INSERT INTO cases (case_title, status, judge_id, lawyer_id, case_actions, created_at)
        VALUES (?, ?, ?, ?, ?, NOW());
    `;
    const values = [case_title, status, judge_id, lawyer_id, case_actions];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ Error inserting case:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        console.log("✅ Case added:", result.insertId);
        res.json({ message: "Case added successfully", case_id: result.insertId });
    });
});

// ✅ Export router
module.exports = router;
