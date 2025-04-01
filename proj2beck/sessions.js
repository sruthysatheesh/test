const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "helloworld", // Add your database password
        database: "judicialsys", // Add your database name
    });

// ✅ Get All Court Sessions
router.get("/sessions", (req, res) => {
    const sql = `
        SELECT cs.id AS session_id, cs.session_date, cs.status, 
               c.case_title, j.username AS judge_name
        FROM court_sessions cs
        JOIN cases c ON cs.case_id = c.id
        JOIN judges j ON cs.judge_id = j.id
        ORDER BY cs.session_date DESC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching court sessions:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// ✅ Get a Single Court Session by ID
router.get("/sessions/:id", (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT cs.id AS session_id, cs.session_date, cs.status, 
               c.case_title, j.username AS judge_name
        FROM court_sessions cs
        JOIN cases c ON cs.case_id = c.id
        JOIN judges j ON cs.judge_id = j.id
        WHERE cs.id = ?;
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error fetching session:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length === 0) return res.status(404).json({ message: "Session not found" });

        res.json(result[0]);
    });
});

// ✅ Schedule a New Court Session
router.post("/sessions", (req, res) => {
    const { case_id, judge_id, session_date, status } = req.body;

    if (!case_id || !judge_id || !session_date || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO court_sessions (case_id, judge_id, session_date, status) VALUES (?, ?, ?, ?)";
    db.query(sql, [case_id, judge_id, session_date, status], (err, result) => {
        if (err) {
            console.error("❌ Error scheduling session:", err.sqlMessage);
            return res.status(500).json({ error: "Database error", details: err.sqlMessage });
        }

        res.json({ message: "✅ Court session scheduled successfully!", sessionId: result.insertId });
    });
});

// ✅ Update Court Session (Date & Status)
router.put("/sessions/:id", (req, res) => {
    const { id } = req.params;
    const { session_date, status } = req.body;

    const sql = "UPDATE court_sessions SET session_date = ?, status = ? WHERE id = ?";
    db.query(sql, [session_date, status, id], (err, result) => {
        if (err) {
            console.error("❌ Error updating session:", err.sqlMessage);
            return res.status(500).json({ error: "Database error", details: err.sqlMessage });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json({ message: "✅ Court session updated successfully!" });
    });
});

// ✅ Delete a Court Session
router.delete("/sessions/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM court_sessions WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error deleting session:", err.sqlMessage);
            return res.status(500).json({ error: "Database error", details: err.sqlMessage });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json({ message: "✅ Court session deleted successfully!" });
    });
});

module.exports = router;
