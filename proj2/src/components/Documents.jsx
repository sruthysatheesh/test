import React, { useEffect, useState } from "react";
import axios from "axios";

const DocumentsDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caseId, setCaseId] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !caseId) {
      alert("Please select a file and enter a case ID.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caseId", caseId);

    try {
      await axios.post("http://localhost:5000/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully!");
      fetchDocuments();
      setSelectedFile(null);
      setCaseId("");
    } catch (err) {
      console.error("Error uploading document:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/documents/${id}`);
      alert("Document deleted successfully!");
      fetchDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  return (
    <div>
      <h2>📂 Document Management</h2>

      {/* File Upload */}
      <div>
        <h3>Upload Document</h3>
        <input type="text" placeholder="Enter Case ID" value={caseId} onChange={(e) => setCaseId(e.target.value)} />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* List of Documents */}
      <div>
        <h3>Uploaded Documents</h3>
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              {doc.filename} (Case ID: {doc.case_id})
              <a href={`http://localhost:5000/documents/download/${doc.id}`} target="_blank" rel="noopener noreferrer">
                📥 Download
              </a>
              <button onClick={() => handleDelete(doc.id)}>❌ Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocumentsDashboard;
