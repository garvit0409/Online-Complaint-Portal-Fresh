import React from 'react';
import AdminDashboard from './components/admindashboard';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/home';
import Status from './components/status';
import Submit from './components/submit';
import AdminLogin from './components/AdminLogin';
import ViewComplaints from './ViewComplaints';
import './styles.css';

function App() {
  return (
    <Router>
      <div>
        <header>
          <h1>Online Complaint & Grievance System</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/submit">Submit Complaint</Link></li>
              <li><Link to="/status">Check Status</Link></li>
              <li><Link to="/admin">Admin Login</Link></li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/status" element={<Status />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/view" element={<ViewComplaints />} />
        </Routes>

        <footer>
          <p>&copy; 2025 Your Organization. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
