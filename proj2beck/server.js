const express = require("express");
const mysql = require("mysql2");
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

// 🔹 Middleware to Verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, "your_secret_key"); // Verify token
      req.user = decoded; // Attach decoded user data to request object
      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid token." });
    }
  };
  

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

// ✅ GET /users - Fetch all users from all tables
app.get("/users", verifyToken, (req, res) => {
    const sql = `
        SELECT id, username, role, 'admin' AS table_name FROM admins
        UNION ALL
        SELECT id, username, role, 'judge' AS table_name FROM judges
        UNION ALL
        SELECT id, username, role, 'lawyer' AS table_name FROM lawyers
        UNION ALL
        SELECT id, username, role, 'clerk' AS table_name FROM clerk
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching users:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});
  
// ✅ POST /users - Create a new user in the respective table
app.post("/users", verifyToken, (req, res) => {
    const { username, password, full_name } = req.body; // Add full_name
    const { table } = req.query; // Get table from query parameters

    if (!username || !password || !full_name || !table) {
        return res.status(400).json({ message: "Username, password, full_name, and table are required." });
    }

    // Insert the new user into the respective table
    const sql = `INSERT INTO ${table} (username, password, full_name) VALUES (?, ?, ?)`; // Include full_name
    db.query(sql, [username, password, full_name], (err, results) => {
        if (err) {
            console.error("❌ Error creating user:", err); // Log the full error
            return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.status(201).json({ message: `User created successfully in ${table} table!` });
    });
});

 // ✅ DELETE /users/:id - Delete a user from the respective table
app.delete("/users/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    const { role } = req.query; // Get role from query parameters

    if (!role) {
        return res.status(400).json({ message: "Role is required as a query parameter." });
    }

    // Determine the table based on the role
    let table;
    switch (role) {
        case "admin":
            table = "admins";
            break;
        case "judge":
            table = "judges";
            break;
        case "lawyer":
            table = "lawyers";
            break;
        case "clerk":
            table = "clerk";
            break;
        default:
            return res.status(400).json({ message: "Invalid role specified." });
    }

    // Delete the user from the respective table
    const sql = `DELETE FROM ${table} WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("❌ Error deleting user:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: `User deleted successfully from ${table} table!` });
    });
});

// Use Cases Routes
app.use("/cases", casesRouter);

// Start Server
app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});
