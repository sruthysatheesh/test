import React, { useState } from "react";
import axios from "axios"; // Import axios for API calls
import "./cases.css"; 

function Cases() {
  // Define state variables for form inputs
  const [case_number, setCaseNumber] = useState("");
  const [case_type, setCaseType] = useState("");
  const [court_id, setCourtId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Ensure correct field names (snake_case)
    const caseData = {
        case_number: case_number, 
        case_type: case_type, 
        court_id: court_id, 
        status: status
    };

    console.log("📤 Sending request with body:", caseData); // Debug request data

    const token = localStorage.getItem("token");

    try {
        const response = await axios.post("http://localhost:5000/cases", JSON.stringify(caseData), {  // 🔥 Force JSON encoding
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Response:", response.data);
        setMessage(response.data.message);

        // Reset form fields
        setCaseNumber("");
        setCaseType("");
        setCourtId("");
        setStatus("Pending");
    } catch (error) {
        console.error("❌ Error response:", error.response?.data || error.message);
        setMessage("❌ Error adding case: " + (error.response?.data?.message || error.message));
    }
};


  return (
    <>
      <header>
        <h1>Manage Cases</h1>
        <nav>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="parties.html">Parties</a></li>
            <li><a href="hearings.html">Hearings</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="add-case">
          <h2>Add a New Case</h2>
          {message && <p>{message}</p>} {/* Display success/error message */}
          <form onSubmit={handleSubmit}>
            <label htmlFor="case-number">Case Number:</label>
            <input
              type="text"
              id="case-number"
              value={case_number} // ✅ Match state variable names
              onChange={(e) => setCaseNumber(e.target.value)}
              required
            />
            <br />

            <label htmlFor="case-type">Case Type:</label>
            <input
              type="text"
              id="case-type"
              value={case_type} // ✅ Match state variable names
              onChange={(e) => setCaseType(e.target.value)}
              required
            />
            <br />

            <label htmlFor="court-id">Court ID:</label>
            <input
              type="number"
              id="court-id"
              value={court_id} // ✅ Match state variable names
              onChange={(e) => setCourtId(e.target.value)}
              required
            />
            <br />

            <label htmlFor="status">Status:</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
            <br />

            <button type="submit">Add Case</button>
          </form>
        </section>

        <section className="cases-list">
          <h2>Existing Cases</h2>
          <ul id="case-list">
            {/* List of cases will be dynamically inserted here */}
          </ul>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Judiciary System</p>
      </footer>
    </>
  );
}

export default Cases;
