import React, { useContext, useEffect, useState } from "react";
import AdminSidebar from "../../../components/sms/AdminSidebar";
import Topbar from "../../../components/sms/Topbar";
import { AuthContext } from "../../../context/AuthContext";
import "../../../styles/sms-dashboard.css";

const PendingApprovals = () => {
  const { token } = useContext(AuthContext);
  const [pending, setPending] = useState([]);
  const [filter, setFilter] = useState("All Pending");
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch("/api/sms/admin/pending-approvals", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setPending);
  }, [token]);

  const filtered = pending.filter(item => {
    if (filter === "Approved Today" && item.status !== 'approved') return false;
    if (filter === "Rejected" && item.status !== 'rejected') return false;
    if (search && !((item.studentId?.name || '').toLowerCase().includes(search.toLowerCase()) || (item.studentId?.studentId || '').toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="sms-dashboard-bg">
      <AdminSidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="Pending Approvals" />
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          {["All Pending", "Approved Today", "Rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'linear-gradient(90deg,#6B21A8,#7C3AED)' : '#1E1B2E', color: '#F8FAFC', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>{f}</button>
          ))}
          <input placeholder="Search by name or ID" value={search} onChange={e => setSearch(e.target.value)} style={{ marginLeft: 'auto', background: '#0F172A', color: '#F8FAFC', border: '1.5px solid #2D2A40', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontSize: '1rem' }} />
        </div>
        <table style={{ width: '100%', background: '#1E1B2E', borderRadius: '0.8rem', color: '#F8FAFC', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#7C3AED' }}>
              <th style={{ padding: '0.7rem' }}>Student Name</th>
              <th>Student ID</th>
              <th>Course</th>
              <th>Fee Amount</th>
              <th>Submitted On</th>
              <th>Payment Proof</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i}>
                <td style={{ padding: '0.7rem' }}>{item.studentId?.name}</td>
                <td>{item.studentId?.studentId}</td>
                <td>{item.courseId?.name}</td>
                <td>PKR {item.amount}</td>
                <td>{new Date(item.submissionDate).toLocaleDateString()}</td>
                <td>
                  {item.paymentProofUrl ? <a href={item.paymentProofUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED', textDecoration: 'underline' }}>View Proof</a> : 'N/A'}
                </td>
                <td>
                  <button style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Approve</button>
                  <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} style={{ color: '#94A3B8', textAlign: 'center' }}>No records found.</td></tr>}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default PendingApprovals;
