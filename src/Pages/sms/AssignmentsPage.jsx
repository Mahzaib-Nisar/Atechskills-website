import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sms/Sidebar";
import Topbar from "../../components/sms/Topbar";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/sms-dashboard.css";

const FILTERS = ["All", "Pending", "Submitted", "Graded"];

const AssignmentsPage = () => {
  const { user, token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    fetch("/api/sms/assignments/my-batch", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAssignments(data || []));
  }, [token]);

  const filtered = assignments.filter(a =>
    filter === "All" ? true : a.status === filter.toLowerCase()
  );

  return (
    <div className="sms-dashboard-bg">
      <Sidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="Assignments" batch={user?.batch} />
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'linear-gradient(90deg,#6B21A8,#7C3AED)' : '#1E1B2E', color: '#F8FAFC', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {filtered.map(a => (
            <div key={a._id} style={{ background: '#1E1B2E', border: '1.5px solid #2D2A40', borderRadius: '1.1rem', padding: '1.5rem', minWidth: 320, position: 'relative' }}>
              <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '1.1rem' }}>{a.title}</div>
              <div style={{ color: '#94A3B8', fontSize: '0.98rem' }}>{a.subject} • {a.instructorName}</div>
              <div>Due: <span style={{ color: new Date(a.dueDate) < new Date() ? '#ef4444' : '#F8FAFC', fontWeight: 600 }}>{new Date(a.dueDate).toLocaleDateString()}</span></div>
              <div>Marks: {a.marks}</div>
              <div>Status: {renderStatus(a.status)}</div>
              <button onClick={() => setExpanded(expanded === a._id ? null : a._id)} style={{ marginTop: '0.7rem', background: '#6B21A8', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>{expanded === a._id ? 'Hide Details' : 'View Details'}</button>
              {expanded === a._id && (
                <div style={{ marginTop: '1rem', color: '#F8FAFC' }}>
                  <div>{a.description}</div>
                  {a.attachmentUrl && <a href={a.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED', textDecoration: 'underline' }}>Download Attachment</a>}
                  {a.status === 'pending' && (
                    <div style={{ marginTop: '1rem' }}>
                      <label style={{ color: '#F8FAFC', fontWeight: 600 }}>Submit Assignment:</label>
                      <input type="file" style={{ display: 'block', margin: '0.7rem 0' }} />
                      <button style={{ background: 'linear-gradient(90deg,#6B21A8,#7C3AED)', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Upload</button>
                    </div>
                  )}
                  {a.status === 'graded' && (
                    <div style={{ marginTop: '1rem', background: '#10B981', color: '#fff', borderRadius: '0.7rem', padding: '0.7rem 1rem', fontWeight: 600 }}>
                      Marks: {a.obtainedMarks} / {a.marks} <br />Feedback: {a.feedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

function renderStatus(status) {
  if (status === 'graded') return <span style={{ background: '#10B981', color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Graded</span>;
  if (status === 'submitted') return <span style={{ background: '#7C3AED', color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Submitted</span>;
  if (status === 'pending') return <span style={{ background: '#fbbf24', color: '#222', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Pending</span>;
  return status;
}

export default AssignmentsPage;
