const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const cors = require("cors");

const router = express.Router();

// ✅ Middleware
router.use(cors());
router.use(express.json());

// ✅ Database Connection (Using Pool)
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "helloworld", // Change this
    database: "judicialsys",
    multipleStatements: true
});

// ✅ Multer Storage (Memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Get All Cases (With Documents)
router.get("/", (req, res) => {
    const sql = `
        SELECT c.case_id, c.case_title, c.status, c.case_actions,
               j.username AS judge_name, l.username AS lawyer_name,
               d.file_name, d.file_type, d.file_size
        FROM cases c
        LEFT JOIN judges j ON c.judge_id = j.id
        LEFT JOIN lawyers l ON c.lawyer_id = l.id
        LEFT JOIN case_documents d ON c.case_id = d.case_id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        const cases = {};
        results.forEach(row => {
            if (!cases[row.case_id]) {
                cases[row.case_id] = {
                    case_id: row.case_id,
                    case_title: row.case_title,
                    status: row.status,
                    case_actions: row.case_actions,
                    judge_name: row.judge_name || "⚠ No Judge Assigned",
                    lawyer_name: row.lawyer_name || "⚠ No Lawyer Assigned",
                    documents: []
                };
            }
            if (row.file_name) {
                cases[row.case_id].documents.push({
                    file_name: row.file_name,
                    file_type: row.file_type,
                    file_size: row.file_size
                });
            }
        });

        res.json(Object.values(cases));
    });
});

// ✅ Get All Judges
router.get("/judges", (req, res) => {
    db.query("SELECT id, username, full_name FROM judges", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ✅ Get All Lawyers
router.get("/lawyers", (req, res) => {
    db.query("SELECT id, username, full_name FROM lawyers", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ✅ Add a Case
router.post("/", upload.array("documents"), (req, res) => {
    const { case_title, judge_id, lawyer_id, case_actions } = req.body;
    const status = "Open";

    if (!case_title || !judge_id || !lawyer_id || !case_actions) {
        return res.status(400).json({ message: "❌ All fields are required" });
    }

    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ error: "Database connection error" });

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                return res.status(500).json({ error: "Transaction error" });
            }

            connection.query(
                "INSERT INTO cases (case_title, status, judge_id, lawyer_id, case_actions) VALUES (?, ?, ?, ?, ?)",
                [case_title, status, judge_id, lawyer_id, case_actions],
                (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ message: "Database error", error: err.message });
                        });
                    }

                    const case_id = results.insertId;

                    if (req.files.length > 0) {
                        const documentQueries = req.files.map((file) => [
                            case_id,
                            file.originalname,
                            file.mimetype,
                            file.size,
                            file.buffer,
                        ]);

                        connection.query(
                            "INSERT INTO case_documents (case_id, file_name, file_type, file_size, file_data) VALUES ?",
                            [documentQueries],
                            (err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        res.status(500).json({ message: "File upload error", error: err.message });
                                    });
                                }

                                connection.commit((commitErr) => {
                                    connection.release();
                                    if (commitErr) {
                                        return res.status(500).json({ message: "Transaction commit failed", error: commitErr.message });
                                    }
                                    res.status(201).json({ message: "✅ Case added successfully with documents", caseId: case_id });
                                });
                            }
                        );
                    } else {
                        connection.commit((commitErr) => {
                            connection.release();
                            if (commitErr) {
                                return res.status(500).json({ message: "Transaction commit failed", error: commitErr.message });
                            }
                            res.status(201).json({ message: "✅ Case added successfully", caseId: case_id });
                        });
                    }
                }
            );
        });
    });
});

// ✅ Export the router
module.exports = router;
