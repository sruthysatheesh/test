const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const router = express.Router();
app.use(express.json());
app.use(cors());

// ✅ MySQL Database Connection (Using Pool for Better Performance)
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "helloworld", // Replace with your MySQL password
    database: "judicialsys",
});

// 🔹 Generate a Unique Case ID
const generateCaseID = () => {
    return "CASE-" + crypto.randomBytes(3).toString("hex").toUpperCase();
};

// 🔹 Generate a Unique Hearing ID
const generateHearingID = () => {
    return "HEARING-" + crypto.randomBytes(3).toString("hex").toUpperCase();
};

// ✅ Get All Judges (Returns `id` & `username`)
app.get("/judges", (req, res) => {
    const sql = "SELECT id, username FROM judges";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching judges:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// ✅ Get All Cases (Returns Judge's Username)
app.get("/cases", (req, res) => {
    const sql = `
        SELECT c.case_id, c.case_title, c.status, j.username AS judge_name
        FROM cases c
        JOIN judges j ON c.judge_id = j.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching cases:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// ✅ Add Case and Auto-Schedule Hearing
app.post("/cases", (req, res) => {
    const { case_title, judge_id } = req.body;
    const case_id = generateCaseID();
    const hearing_id = generateHearingID();
    const status = "Open"; // ✅ Default status

    if (!case_title || !judge_id) {
        return res.status(400).json({ message: "❌ All fields are required" });
    }

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Database connection error" });

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: "Transaction error" });
            }

            console.log("✅ Adding Case:", case_id, case_title, status, judge_id);

            // ✅ Insert Case
            connection.query(
                "INSERT INTO cases (case_id, case_title, status, judge_id) VALUES (?, ?, ?, ?)",
                [case_id, case_title, status, judge_id],
                (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error("❌ Error inserting case:", err.message);
                            res.status(500).json({ message: "Database error", error: err.message });
                        });
                    }

                    // ✅ Auto-Schedule Hearing (7 days later)
                    const hearing_date = new Date();
                    hearing_date.setDate(hearing_date.getDate() + 7);

                    console.log("✅ Scheduling Hearing:", hearing_id, case_id, judge_id, hearing_date);

                    connection.query(
                        "INSERT INTO hearings (hearing_id, case_id, judge_id, hearing_date, status) VALUES (?, ?, ?, ?, ?)",
                        [hearing_id, case_id, judge_id, hearing_date, "Scheduled"],
                        (err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.error("❌ Error scheduling hearing:", err.message);
                                    res.status(500).json({ message: "Hearing scheduling failed", error: err.message });
                                });
                            }

                            connection.commit((commitErr) => {
                                connection.release();
                                if (commitErr) {
                                    return res.status(500).json({ message: "Transaction commit failed", error: commitErr.message });
                                }
                                console.log("✅ Case and Hearing Added Successfully!");
                                res.status(201).json({ message: "✅ Case and Hearing added successfully", caseId: case_id, hearingId: hearing_id });
                            });
                        }
                    );
                }
            );
        });
    });
});

// ✅ Update Case
app.put("/cases/:case_id/close", (req, res) => {
    const { case_id } = req.params;
    console.log("🔍 Close Case API called for:", case_id);

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Database connection error" });

        connection.query("SELECT * FROM cases WHERE case_id = ?", [case_id], (err, results) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: "Database query error" });
            }

            console.log("🔎 Database Query Results:", results); // Debugging

            if (results.length === 0) {
                console.log("❌ Case Not Found:", case_id);
                connection.release();
                return res.status(404).json({ error: "Case not found!" });
            }

            console.log("✅ Case Found:", results[0]);

            connection.query("UPDATE cases SET status = 'Closed' WHERE case_id = ?", [case_id], (err) => {
                if (err) {
                    connection.release();
                    return res.status(500).json({ error: "Failed to update case status" });
                }

                connection.query("UPDATE hearings SET status = 'Completed' WHERE case_id = ?", [case_id], (err) => {
                    connection.release();
                    if (err) {
                        return res.status(500).json({ error: "Failed to update hearings" });
                    }
                    console.log("✅ Case Closed & Hearings Updated");
                    res.json({ message: "✅ Case closed successfully, hearings updated" });
                });
            });
        });
    });
});


// ✅ Delete Case (Deletes Related Hearings Too)
app.delete("/cases/:case_id", (req, res) => {
    const { case_id } = req.params;

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Database connection error" });

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: "Transaction error" });
            }

            // ✅ Delete related hearings first
            connection.query("DELETE FROM hearings WHERE case_id = ?", [case_id], (err) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        console.error("❌ Error deleting hearings:", err);
                        res.status(500).json({ error: "Failed to delete hearings" });
                    });
                }

                // ✅ Delete the case
                connection.query("DELETE FROM cases WHERE case_id = ?", [case_id], (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error("❌ Error deleting case:", err);
                            res.status(500).json({ error: "Failed to delete case" });
                        });
                    }

                    connection.commit((commitErr) => {
                        connection.release();
                        if (commitErr) {
                            return res.status(500).json({ error: "Transaction commit failed" });
                        }
                        res.json({ message: "✅ Case and related hearings deleted successfully" });
                    });
                });
            });
        });
    });
});

// ✅ Start Server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

module.exports = router;