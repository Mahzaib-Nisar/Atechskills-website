import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sms/Sidebar";
import Topbar from "../../components/sms/Topbar";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/sms-dashboard.css";

const FeeChallanPage = () => {
  const { user, token } = useContext(AuthContext);
  const [challans, setChallans] = useState([]);
  useEffect(() => {
    fetch("/api/sms/fee/my-challans", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setChallans(data || []));
  }, [token]);

  return (
    <div className="sms-dashboard-bg">
      <Sidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="Fee Challan" batch={user?.batch} />
        <h2 style={{ color: '#F8FAFC', marginBottom: '1.5rem' }}>My Fee Challans</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {challans.map(challan => (
            <div key={challan._id} style={{ background: '#1E1B2E', border: '1.5px solid #2D2A40', borderRadius: '1.1rem', padding: '1.5rem', minWidth: 260 }}>
              <div style={{ fontWeight: 600, color: '#F8FAFC' }}>Challan No: {challan.challanNo}</div>
              <div>Amount: <span style={{ color: '#6B21A8', fontWeight: 600 }}>PKR {challan.amount}</span></div>
              <div>Due: {challan.dueDate ? new Date(challan.dueDate).toLocaleDateString() : '-'}</div>
              <div>Status: {renderStatus(challan.status, challan.rejectionReason)}</div>
              {challan.status === 'approved' && (
                <a href={`/api/sms/fee/download/${challan._id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '1rem', background: 'linear-gradient(90deg,#6B21A8,#7C3AED)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '0.7rem', textDecoration: 'none', fontWeight: 600 }}>Download Challan PDF</a>
              )}
              {challan.status === 'rejected' && (
                <button style={{ marginTop: '1rem', background: '#6B21A8', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.6rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Re-submit</button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

function renderStatus(status, reason) {
  if (status === 'approved') return <span style={{ background: '#10B981', color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Approved</span>;
  if (status === 'pending') return <span style={{ background: '#fbbf24', color: '#222', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Pending</span>;
  if (status === 'rejected') return <span style={{ background: '#ef4444', color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Rejected: {reason}</span>;
  return status;
}

export default FeeChallanPage;
