const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// ✅ Import Cases Routes
const caseRoutes = require("./cases");
app.use("/cases", caseRoutes);

// ✅ MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "helloworld", // Add your database password
    database: "judicialsys", // Add your database name
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection error:", err);
        return;
    }
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

        // ✅ Plaintext password comparison (Consider using hashing for security)
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username, role }, "your_secret_key", { expiresIn: "1h" });
        res.json({ message: "Login successful", token, userId: user.id, role });
    });
});

// ✅ GET User by ID
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

    db.query(sql, [id, id, id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(results[0]);
    });
});

// ✅ GET All Users
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
            console.error("❌ Error fetching users:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.json(results);
    });
});

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    jwt.verify(token, "your_secret_key", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token." });
        req.user = decoded;
        next();
    });
};

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
