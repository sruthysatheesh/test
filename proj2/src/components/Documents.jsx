import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Document.css";

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
    <div className="documents-dashboard">
      <div className="floating-shapes">
        <div></div>
        <div></div>
      </div>
      
      <h2>📂 Document Management</h2>

      {/* File Upload */}
      <div className="upload-section">
        <h3>Upload Document</h3>
        <div className="upload-form">
          <div className="form-group">
            <label>Case ID</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter Case ID" 
              value={caseId} 
              onChange={(e) => setCaseId(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Document</label>
            <div className="file-upload">
              <label className="file-upload-label">
                {selectedFile 
                  ? selectedFile.name 
                  : "Drag & drop files or click to browse"}
                <input 
                  type="file" 
                  className="file-upload-input" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
          </div>
        </div>
        
        <button 
          className="upload-btn" 
          onClick={handleUpload}
          disabled={!selectedFile || !caseId}
        >
          Upload Document
        </button>
      </div>

      {/* List of Documents */}
      <div className="documents-list">
        <h3>Uploaded Documents</h3>
        {documents.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div>
            {documents.map((doc) => (
              <div className="document-card" key={doc.id}>
                <div className="document-icon">📄</div>
                <div className="document-info">
                  <div className="document-name">{doc.filename}</div>
                  <div className="document-meta">Case ID: {doc.case_id}</div>
                </div>
                <div className="document-actions">
                  <a 
                    href={`http://localhost:5000/documents/download/${doc.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="action-btn download-btn"
                  >
                    📥 Download
                  </a>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="action-btn delete-btn"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsDashboard;