const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "helloworld",
    database: "judicialsys",
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ MySQL connected!");
});

// ✅ LOGIN Route
app.post("/login", (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Username, password, and role are required" });
    }

    let table = role === "judge" ? "judges" : 
                role === "lawyer" ? "lawyers" : 
                role === "clerk" ? "clerk" :
                role === "admin" ? "admins" : null;
                
    if (!table) return res.status(400).json({ message: "Invalid role" });

    const sql = `SELECT * FROM ${table} WHERE username = ?;`;
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });

        if (results.length === 0) return res.status(400).json({ message: "User not found" });

        const user = results[0];

        // ✅ Plaintext password comparison
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username, role }, "your_secret_key", { expiresIn: "1h" });

        res.json({ 
            message: "Login successful", 
            token, 
            userId: user.id, 
            role: role 
        });
    });
});

app.get("/dashboard/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 'judge' AS role, id, username FROM judges WHERE id = ?
        UNION 
        SELECT 'lawyer' AS role, id, username FROM lawyers WHERE id = ?
        UNION 
        SELECT 'clerk' AS role, id, username FROM clerk WHERE id = ?
        UNION
        SELECT 'admin' AS role, id, username FROM admins WHERE id = ?;
    `;

    db.query(sql, [id, id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(results[0]); // Return user details
    });
});


// ✅ Create User Route (Admin can add Judges & Lawyers)
app.post("/users", (req, res) => {
    const { username, password, role, email, full_name, phone } = req.body;

    if (!username || !password || !role || !email || !full_name || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let table = role === "judge" ? "judges" : 
                role === "lawyer" ? "lawyers" : 
                role === "clerk" ? "clerk" :
                role === "admin" ? "admins" : null;

    if (!table) return res.status(400).json({ message: "Invalid role" });

    const sql = `INSERT INTO ${table} (username, password, email, full_name, phone) VALUES (?, ?, ?, ?, ?);`;

    db.query(sql, [username, password, email, full_name, phone], (err, result) => {
        if (err) {
            console.error("❌ Error inserting user:", err); // Log the full error
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `${role} created successfully`, userId: result.insertId });
    });
});

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    // Step 1: Check if the user exists in judges, lawyers, or clerk
    db.query(
        `SELECT 'judge' AS role FROM judges WHERE id = ?
        UNION SELECT 'lawyer' AS role FROM lawyers WHERE id = ?
        UNION SELECT 'clerk' AS role FROM clerk WHERE id = ?`,
        [id, id, id],
        (err, results) => {
            if (err) {
                console.error("❌ Error checking user:", err);
                return res.status(500).json({ message: "Internal server error." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }

            // Step 2: Determine the correct table based on role
            const role = results[0].role;
            const table = role === "judge" ? "judges" :
                          role === "lawyer" ? "lawyers" :
                          role === "clerk" ? "clerk" : null;

            if (!table) return res.status(400).json({ message: "Invalid user role." });

            // Step 3: Log for debugging
            console.log(`🗑️ Deleting from table: ${table}, ID: ${id}`);

            // Step 4: Execute DELETE query
            db.query(`DELETE FROM ${table} WHERE id = ?`, [id], (err, deleteResult) => {
                if (err) {
                    console.error("❌ Error deleting user:", err);
                    return res.status(500).json({ message: "Internal server error." });
                }

                if (deleteResult.affectedRows === 0) {
                    return res.status(404).json({ message: "User not found in " + table });
                }

                res.status(200).json({ message: `✅ User deleted successfully from ${table}!` });
            });
        }
    );
});


app.get("/users", (req, res) => {
    const sql = `
    SELECT id, username, email, full_name, phone, 'judge' AS role FROM judges
    UNION ALL
    SELECT id, username, email, full_name, phone, 'lawyer' AS role FROM lawyers
    UNION ALL
    SELECT id, username, email, full_name, phone, 'admin' AS role FROM admins
    UNION ALL
    SELECT id, username, email, full_name, phone, 'clerk' AS role FROM clerk;
`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching users:", err); // Log error details
            return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.json(results);
    });
});



// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});