const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MySQL Database Connection
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "NewPassword", // Change as needed
    database: "judicialsys",
});

// ✅ Generate Unique IDs
const generateCaseID = () => "CASE-" + crypto.randomBytes(3).toString("hex").toUpperCase();
const generateHearingID = () => "HEARING-" + crypto.randomBytes(3).toString("hex").toUpperCase();

/* ==========  GET ENDPOINTS  ========== */

// ✅ Get All Judges
app.get("/judges", (req, res) => {
    db.query("SELECT id, username FROM judges", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ✅ Get All Cases (With Assigned Judge)
app.get("/cases", (req, res) => {
    const sql = `
        SELECT c.case_id, c.case_title, c.status, j.username AS judge_name
        FROM cases c
        JOIN judges j ON c.judge_id = j.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ✅ Get All Hearings (With Case and Judge Names)
app.get("/hearings", (req, res) => {
    const sql = `
        SELECT h.hearing_id, h.hearing_date, h.status,
               c.case_title, j.username AS judge_name
        FROM hearings h
        JOIN cases c ON h.case_id = c.case_id
        JOIN judges j ON h.judge_id = j.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

/* ==========  POST ENDPOINTS  ========== */

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

            // ✅ Insert Case
            connection.query(
                "INSERT INTO cases (case_id, case_title, status, judge_id) VALUES (?, ?, ?, ?)",
                [case_id, case_title, status, judge_id],
                (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ message: "Database error", error: err.message });
                        });
                    }

                    // ✅ Auto-Schedule Hearing (7 days later)
                    const hearing_date = new Date();
                    hearing_date.setDate(hearing_date.getDate() + 7);

                    connection.query(
                        "INSERT INTO hearings (hearing_id, case_id, judge_id, hearing_date, status) VALUES (?, ?, ?, ?, ?)",
                        [hearing_id, case_id, judge_id, hearing_date, "Scheduled"],
                        (err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: "Hearing scheduling failed", error: err.message });
                                });
                            }

                            connection.commit((commitErr) => {
                                connection.release();
                                if (commitErr) {
                                    return res.status(500).json({ message: "Transaction commit failed", error: commitErr.message });
                                }
                                res.status(201).json({ message: "✅ Case and Hearing added successfully", caseId: case_id, hearingId: hearing_id });
                            });
                        }
                    );
                }
            );
        });
    });
});

/* ==========  PUT & DELETE ENDPOINTS  ========== */

// ✅ Update a Hearing
// ✅ Edit Hearing Schedule
app.put("/hearings/:hearing_id", (req, res) => {
    const { status } = req.body;
    let { hearing_date } = req.body;
    const { hearing_id } = req.params;

    console.log("🔹 Update Hearing Request:");
    console.log("Hearing ID:", hearing_id);
    console.log("New Hearing Date (Before Formatting):", req.body.hearing_date);

    // ✅ Convert ISO format to MySQL DATETIME
    hearing_date = new Date(hearing_date).toISOString().slice(0, 19).replace("T", " ");

    console.log("Formatted Hearing Date for MySQL:", hearing_date);
    console.log("New Status:", status);

    if (!hearing_date || !status) {
        console.log("❌ Missing fields");
        return res.status(400).json({ message: "❌ Hearing date and status are required" });
    }

    const sql = "UPDATE hearings SET hearing_date = ?, status = ? WHERE hearing_id = ?";
    db.query(sql, [hearing_date, status, hearing_id], (err, result) => {
        if (err) {
            console.error("❌ SQL Error:", err.sqlMessage || err);
            return res.status(500).json({ error: "Database error", details: err.sqlMessage || err });
        }

        console.log("✅ Hearing Updated:", result);
        res.json({ message: "✅ Hearing updated successfully" });
    });
});




// ✅ Close a Case (Updates Case & Related Hearings)
// ✅ Close a Case (Updates Case & Related Hearings)
app.put("/cases/:case_id/close", (req, res) => {
    const { case_id } = req.params;
    console.log("✅ Closing Case Request Received:", case_id);

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Database connection error" });

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: "Transaction error" });
            }

            // ✅ Check if Case Exists
            connection.query("SELECT * FROM cases WHERE case_id = ?", [case_id], (err, results) => {
                if (err) {
                    connection.release();
                    return res.status(500).json({ error: "Database query error" });
                }

                if (results.length === 0) {
                    console.log("❌ Case Not Found:", case_id);
                    connection.release();
                    return res.status(404).json({ error: "Case not found!" });
                }

                console.log("✅ Case Found:", results[0]);

                // ✅ Update Case Status to "Closed"
                connection.query(
                    "UPDATE cases SET status = 'Closed' WHERE case_id = ?",
                    [case_id],
                    (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                console.error("❌ Error closing case:", err);
                                res.status(500).json({ error: "Failed to close case" });
                            });
                        }

                        console.log("✅ Case Closed");

                        // ✅ Update Related Hearings to "Completed"
                        connection.query(
                            "UPDATE hearings SET status = 'Completed' WHERE case_id = ?",
                            [case_id],
                            (err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.error("❌ Error updating hearings:", err);
                                        res.status(500).json({ error: "Failed to update hearings" });
                                    });
                                }

                                console.log("✅ Hearings Updated");

                                // ✅ Commit Transaction
                                connection.commit((commitErr) => {
                                    connection.release();
                                    if (commitErr) {
                                        return res.status(500).json({ error: "Transaction commit failed" });
                                    }
                                    console.log("✅ Case Closed & Hearings Updated");
                                    res.json({ message: "✅ Case closed successfully, hearings updated" });
                                });
                            }
                        );
                    }
                );
            });
        });
    });
});



// ✅ Delete a Hearing
app.delete("/hearings/:hearing_id", (req, res) => {
    const { hearing_id } = req.params;

    db.query("DELETE FROM hearings WHERE hearing_id = ?", [hearing_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ Hearing deleted successfully" });
    });
});

// ✅ Start Server
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use. Try using a different port.`);
    } else {
        console.error("❌ Server error:", err);
    }
});
