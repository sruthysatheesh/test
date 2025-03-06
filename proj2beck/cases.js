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

// ✅ Multer Memory Storage (No Disk Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Fetch Judges
router.get("/judges", (req, res) => {
    db.query("SELECT id, full_name FROM judges", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});
router.get("/judges/cases", (req, res) => {
    const { judge_id } = req.query; // Corrected to match request query

    if (!judge_id) {
        return res.status(400).json({ error: "Judge ID is required." });
    }

    const sql = 
        `SELECT c.case_id, c.case_title, c.status, c.case_actions, 
               j.full_name AS judge_name, 
               l.full_name AS lawyer_name
        FROM cases c
        LEFT JOIN judges j ON c.judge_id = j.id
        LEFT JOIN lawyers l ON c.lawyer_id = l.id
        WHERE c.judge_id = ?
        ORDER BY c.created_at DESC;
    ;`

    db.query(sql, [judge_id], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
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
    const sql = 
        `SELECT c.case_id, c.case_title, c.status, c.case_actions, 
               j.full_name AS judge_name, 
               l.full_name AS lawyer_name
        FROM cases c
        LEFT JOIN judges j ON c.judge_id = j.id
        LEFT JOIN lawyers l ON c.lawyer_id = l.id
        ORDER BY c.created_at DESC;
    ;`

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Database error fetching cases:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.json(results);
    });
});
// ✅ Add Case with File Upload
router.post("/", upload.array("documents", 5), (req, res) => {
    const { case_title, judge_id, lawyer_id, status, case_actions } = req.body;

    if (!case_title || !judge_id || !lawyer_id || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `INSERT INTO cases (case_title, judge_id, lawyer_id, status, case_actions, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;

    db.query(sql, [case_title, judge_id, lawyer_id, status, case_actions], (err, result) => {
        if (err) {
            console.error("❌ Error inserting case:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        const case_id = result.insertId;
        const uploadedFiles = req.files;

        if (uploadedFiles.length === 0) {
            return res.json({ message: "Case added successfully", case_id });
        }

        // ✅ Insert Documents into `case_documents` table
        const documentSql = `INSERT INTO case_documents (case_id, file_name, file_data, created_at) VALUES ?`;
        const documentValues = uploadedFiles.map((file) => [case_id, file.originalname, file.buffer, new Date()]);

        db.query(documentSql, [documentValues], (err) => {
            if (err) {
                console.error("❌ Error inserting documents:", err);
                return res.status(500).json({ error: "Database error (documents)", details: err.message });
            }

            res.json({ message: "Case and documents added successfully", case_id });
        });
    });
});

// ✅ Export router
module.exports = router;
