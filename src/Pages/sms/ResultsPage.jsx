import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sms/Sidebar";
import Topbar from "../../components/sms/Topbar";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/sms-dashboard.css";

const ResultsPage = () => {
  const { user, token } = useContext(AuthContext);
  const [results, setResults] = useState(null);
  const [published, setPublished] = useState(false);
  useEffect(() => {
    fetch("/api/sms/results/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setPublished(data?.isPublished);
      });
  }, [token]);

  if (!published)
    return (
      <div className="sms-dashboard-bg">
        <Sidebar />
        <main className="sms-dashboard-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <img src="/logo512.png" alt="ATech Skills" style={{ width: 80, marginBottom: 24 }} />
          <h2 style={{ color: '#F8FAFC' }}>Results not announced yet</h2>
        </main>
      </div>
    );

  return (
    <div className="sms-dashboard-bg">
      <Sidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="My Results" batch={user?.batch} />
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: '#1E1B2E', borderRadius: '1.1rem', border: '1.5px solid #2D2A40', padding: '1.5rem', minWidth: 180 }}>
            <div style={{ color: '#94A3B8', fontSize: '1.05rem' }}>Percentage</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem' }}>{results?.percentage || '-'}</div>
          </div>
          <div style={{ background: '#1E1B2E', borderRadius: '1.1rem', border: '1.5px solid #2D2A40', padding: '1.5rem', minWidth: 180 }}>
            <div style={{ color: '#94A3B8', fontSize: '1.05rem' }}>CGPA</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem' }}>{results?.cgpa || '-'}</div>
          </div>
          <div style={{ background: '#1E1B2E', borderRadius: '1.1rem', border: '1.5px solid #2D2A40', padding: '1.5rem', minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#94A3B8', fontSize: '1.05rem' }}>Overall Grade</div>
            <div style={{ background: getGradeColor(results?.grade), color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.3rem', marginTop: 8 }}>{results?.grade || '-'}</div>
          </div>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#6B21A8' }}>Subjects</h3>
          <table style={{ width: '100%', background: '#1E1B2E', borderRadius: '0.8rem', color: '#F8FAFC', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#7C3AED' }}>
                <th style={{ padding: '0.7rem' }}>Subject</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {(results?.subjects || []).map((s, i) => (
                <tr key={i}>
                  <td style={{ padding: '0.7rem' }}>{s.name}</td>
                  <td>{s.marks}</td>
                  <td>{s.total}</td>
                  <td><span style={{ background: getGradeColor(s.grade), color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>{s.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button style={{ background: 'linear-gradient(90deg,#6B21A8,#7C3AED)', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => window.open(`/api/sms/results/download/${results?._id}`)}>Download Grade Card</button>
      </main>
    </div>
  );
};

function getGradeColor(grade) {
  if (grade === 'A') return '#10B981';
  if (grade === 'B') return '#7C3AED';
  if (grade === 'C') return '#fbbf24';
  if (grade === 'F') return '#ef4444';
  return '#94A3B8';
}

export default ResultsPage;
