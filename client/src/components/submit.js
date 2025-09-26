import React, { useState } from 'react';

function Submit() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    description: '',
    attachment: null,
  });
  const [error, setError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const maxCharacters = 500;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setFormData({ ...formData, attachment: files[0] });
    } else if (name === 'description' && value.length > maxCharacters) {
      // Do nothing if over the character limit
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.type || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');

    // Use FormData to send file and text fields together
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('email', formData.email);
    dataToSend.append('type', formData.type);
    dataToSend.append('description', formData.description);
    if (formData.attachment) {
      dataToSend.append('attachment', formData.attachment);
    }

    try {
      // This is the updated line with the live server URL
      const res = await fetch('https://online-complaint-and-grievance-portal.onrender.com/api/complaints', {
        method: 'POST',
        // Do NOT set Content-Type header, the browser will do it for FormData
        body: dataToSend,
      });

      if (!res.ok) throw new Error('Submission failed');

      const data = await res.json();
      setTrackingId(data.trackingId);
      setSubmissionSuccess(true);
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
    }
  };

  const handleNewComplaint = () => {
    setFormData({
      name: '',
      email: '',
      type: '',
      description: '',
      attachment: null,
    });
    setSubmissionSuccess(false);
    setTrackingId('');
    setError('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '20px'
    }}>
      {submissionSuccess ? (
        <div style={{
          width: '100%',
          maxWidth: '500px',
          padding: '40px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          backgroundColor: '#fff',
          textAlign: 'center'
        }}>
          <h2>Submission Successful!</h2>
          <p>Your complaint has been submitted successfully. </p>
          <p>Your unique Tracking ID is: <strong>{trackingId}</strong></p>
          <p>Please keep this ID to check the status of your complaint.</p>
          <button 
            onClick={handleNewComplaint}
            style={{
              padding: '10px 20px', 
              backgroundColor: '#007BFF', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Submit Another Complaint
          </button>
        </div>
      ) : (
        <>
          <h2 style={{ marginBottom: '20px' }}>Submit a Complaint</h2>
          <form
            onSubmit={handleSubmit}
            style={{
              width: '100%',
              maxWidth: '600px',
              padding: '30px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input 
                id="name"
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input 
                id="email"
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Complaint Type:</label>
              <select 
                id="type"
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="service">Service</option>
                <option value="staff">Staff Behavior</option>
                <option value="technical">Technical Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea 
                id="description"
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="5"
                maxLength={maxCharacters}
                required
              />
              <div className="char-counter">
                {formData.description.length} / {maxCharacters}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="attachment">Attach File (Optional):</label>
              <input 
                id="attachment"
                type="file" 
                name="attachment" 
                onChange={handleChange}
              />
            </div>

            {error && <p style={{ color: 'red', margin: '0' }}>{error}</p>}

            <button 
              type="submit"
            >
              Submit Complaint
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Submit;