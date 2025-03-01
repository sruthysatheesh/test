const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const casesRouter = require("./cases"); // Import cases.js

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to call the backend
app.use("/cases", casesRouter);

// Create MySQL Connection
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

// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const sql = "SELECT * FROM judges WHERE username = ?;";
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];

        // Compare plaintext passwords
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, username: user.username }, "your_secret_key", { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    });
});

// Use Cases Routes
app.use("/cases", casesRouter);

// Start Server
app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});
