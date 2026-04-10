import React, { useContext, useEffect, useState } from "react";
import AdminSidebar from "../../../components/sms/AdminSidebar";
import Topbar from "../../../components/sms/Topbar";
import { AuthContext } from "../../../context/AuthContext";
import "../../../styles/sms-dashboard.css";

const FeeManagement = () => {
  const { token } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);
  const [form, setForm] = useState({ studentId: '', courseId: '', amount: '', dueDate: '', label: '' });

  useEffect(() => {
    fetch("/api/sms/admin/enrolled-students", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setStudents);
    fetch("/api/sms/courses/all", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setCourses);
    fetch("/api/sms/admin/fee-records", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setFeeRecords);
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCourseChange = e => {
    const courseId = e.target.value;
    const course = courses.find(c => c._id === courseId);
    setForm({ ...form, courseId, amount: course?.fee || '' });
  };

  // Add submit handler for challan creation

  return (
    <div className="sms-dashboard-bg">
      <AdminSidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="Fee Management" />
        <div style={{ marginBottom: '2rem', background: '#1E1B2E', borderRadius: '1.1rem', border: '1.5px solid #2D2A40', padding: '2rem', maxWidth: 600 }}>
          <h3 style={{ color: '#6B21A8', marginBottom: '1rem' }}>Create Fee Challan</h3>
          <form style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem' }}>
            <select name="studentId" value={form.studentId} onChange={handleChange} style={inputStyle}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>)}
            </select>
            <select name="courseId" value={form.courseId} onChange={handleCourseChange} style={inputStyle}>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" style={inputStyle} />
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} style={inputStyle} />
            <input name="label" value={form.label} onChange={handleChange} placeholder="Semester/Month" style={inputStyle} />
            <button type="button" style={{ background: 'linear-gradient(90deg,#6B21A8,#7C3AED)', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Generate Challan</button>
          </form>
        </div>
        <h3 style={{ color: '#6B21A8', marginBottom: '1rem' }}>All Fee Records</h3>
        <table style={{ width: '100%', background: '#1E1B2E', borderRadius: '0.8rem', color: '#F8FAFC', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#7C3AED' }}>
              <th style={{ padding: '0.7rem' }}>Challan No</th>
              <th>Student</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeRecords.map((f, i) => (
              <tr key={i}>
                <td style={{ padding: '0.7rem' }}>{f.challanNo}</td>
                <td>{f.studentId?.name}</td>
                <td>{f.courseId?.name}</td>
                <td>PKR {f.amount}</td>
                <td>{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '-'}</td>
                <td>{renderStatus(f.status)}</td>
                <td>
                  <button style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Download PDF</button>
                  <button style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Mark as Paid</button>
                  <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {feeRecords.length === 0 && <tr><td colSpan={7} style={{ color: '#94A3B8', textAlign: 'center' }}>No records found.</td></tr>}
          </tbody>
        </table>
      </main>
    </div>
  );
};

const inputStyle = {
  background: '#0F172A',
  color: '#F8FAFC',
  border: '1.5px solid #2D2A40',
  borderRadius: '0.7rem',
  padding: '0.7rem 1rem',
  fontSize: '1rem',
};

function renderStatus(status) {
  if (status === 'approved') return <span style={{ background: '#10B981', color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Approved</span>;
  if (status === 'pending') return <span style={{ background: '#fbbf24', color: '#222', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Pending</span>;
  if (status === 'rejected') return <span style={{ background: '#ef4444', color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Rejected</span>;
  if (status === 'overdue') return <span style={{ background: '#ef4444', color: '#fff', borderRadius: '0.5rem', padding: '0.2rem 0.7rem', fontWeight: 600 }}>Overdue</span>;
  return status;
}

export default FeeManagement;
