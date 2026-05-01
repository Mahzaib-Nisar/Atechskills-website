import React, { useContext, useEffect, useState } from "react";
import AdminSidebar from "../../../components/sms/AdminSidebar";
import Topbar from "../../../components/sms/Topbar";
import { AuthContext } from "../../../context/AuthContext";
import "../../../styles/sms-dashboard.css";

const CoursesAndBatches = () => {
  const { token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetch("/api/sms/courses/all", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setCourses);
  }, [token]);

  return (
    <div className="sms-dashboard-bg">
      <AdminSidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="Courses & Batches" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {courses.map((c, i) => (
            <div key={i} style={{ background: '#1E1B2E', border: '1.5px solid #2D2A40', borderRadius: '1.1rem', padding: '1.5rem', minWidth: 320, position: 'relative' }}>
              <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '1.1rem' }}>{c.name}</div>
              <div style={{ color: '#94A3B8', fontSize: '0.98rem' }}>{c.bootcampType === 'short' ? 'Short Bootcamp' : 'Complete Bootcamp'} {c.track && `- ${c.track}`}</div>
              <div>Fee: <span style={{ color: '#6B21A8', fontWeight: 600 }}>PKR {c.fee}</span></div>
              <div>Batch: {c.batchNo}</div>
              <div>Enrolled: <span style={{ color: '#10B981', fontWeight: 600 }}>{c.enrolledCount}</span> / {c.maxSeats}</div>
              <div style={{ background: '#2D2A40', borderRadius: '0.5rem', height: 8, margin: '0.7rem 0', width: '100%' }}>
                <div style={{ background: 'linear-gradient(90deg,#6B21A8,#7C3AED)', height: 8, borderRadius: '0.5rem', width: `${(c.enrolledCount / (c.maxSeats || 1)) * 100}%` }}></div>
              </div>
              <button style={{ background: '#6B21A8', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Edit</button>
              <button style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}>Add Batch</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursesAndBatches;
