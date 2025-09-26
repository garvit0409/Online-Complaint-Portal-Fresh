// In client/client/src/ViewComplaints.js
import React, { useEffect, useState } from 'react';

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // This is the updated line with the live server URL
        const res = await fetch("https://online-complaint-and-grievance-portal.onrender.com/api/complaints");
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.complaintType}</td>
                <td>{c.description}</td>
                <td>{c.status}</td>
                <td>{new Date(c.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewComplaints;