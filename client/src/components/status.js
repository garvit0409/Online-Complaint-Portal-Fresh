// In client/client/src/components/status.js
import React, { useState } from 'react';

function Status() {
  const [identifier, setIdentifier] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState('');
  const [reopenReason, setReopenReason] = useState('');

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setMessage('');
    setComplaints([]);

    try {
      // Corrected URL: changed from '/complaints' to '/complaints/status'
      const res = await fetch('https://online-complaint-and-grievance-portal.onrender.com/api/complaints/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      
      const data = await res.json();
      setComplaints(data);
      
    } catch (err) {
      setMessage(err.message || 'No complaints found.');
    }
  };

  const handleReopen = async (e, complaintId) => {
    e.preventDefault();
    if (!reopenReason) {
        setMessage('Please provide a reason to reopen the complaint.');
        return;
    }

    try {
        const res = await fetch(`https://online-complaint-and-grievance-portal.onrender.com/api/complaints/${complaintId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reopenReason: reopenReason }),
        });

        if (!res.ok) {
            throw new Error('Failed to reopen complaint.');
        }

        setMessage('Your reopen request has been submitted successfully!');
        setComplaints([]); // Clear the displayed complaints
        setReopenReason('');

    } catch (err) {
        setMessage(err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Check Complaint Status</h2>
      
      <p style={{ marginTop: '20px' }}>
        Enter your complaint ID or email to view the status.
      </p>
      
      <form onSubmit={handleCheckStatus} style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter Complaint ID or Email" 
          required
          style={{ padding: '10px', marginRight: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Check Status</button>
      </form>

      {message && (
        <p style={{ marginTop: '20px', color: message.includes('successfully') ? 'green' : 'red' }}>
          {message}
        </p>
      )}

      {complaints.length > 0 && (
        <div style={{ marginTop: '30px', maxWidth: '800px', margin: '30px auto' }}>
          <h3>Complaint Details</h3>
          {complaints.map(complaint => (
            <div key={complaint._id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <p><strong>Tracking ID:</strong> {complaint._id}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Submitted:</strong> {new Date(complaint.submittedAt).toLocaleString()}</p>
              
              {complaint.status === 'Closed' && (
                <div style={{ marginTop: '20px' }}>
                  <h4>Not satisfied? Reopen the complaint.</h4>
                  <form onSubmit={(e) => handleReopen(e, complaint._id)}>
                    <textarea
                      onChange={(e) => setReopenReason(e.target.value)}
                      placeholder="Reason for reopening"
                      rows="4"
                      required
                      style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'orange', border: 'none', color: 'white', cursor: 'pointer' }}>
                      Reopen Complaint
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Status;