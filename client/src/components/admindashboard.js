// In client/client/src/components/admindashboard.js
import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      // Updated URL
      const res = await fetch("https://online-complaint-and-grievance-portal.onrender.com/api/complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Updated URL
      await fetch(`https://online-complaint-and-grievance-portal.onrender.com/api/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchComplaints();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        // Updated URL
        await fetch(`https://online-complaint-and-grievance-portal.onrender.com/api/complaints/${id}`, {
          method: 'DELETE',
        });
        fetchComplaints();
      } catch (err) {
        console.error("Error deleting complaint:", err);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Description</th>
              <th>Attachment</th>
              <th>Status</th>
              <th>Reopen Reason</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.description}</td>
                <td>
                  {c.attachment ? (
                    // Updated URL for viewing attachments
                    <a href={`https://online-complaint-and-grievance-portal.onrender.com/${c.attachment.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : (
                    'None'
                  )}
                </td>
                <td>{c.status}</td>
                <td>{c.reopenReason}</td>
                <td>{new Date(c.submittedAt).toLocaleString()}</td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    style={{ marginRight: '10px' }}
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Reopened">Reopened</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <button onClick={() => handleDelete(c._id)} style={{ backgroundColor: 'red', color: 'white' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;