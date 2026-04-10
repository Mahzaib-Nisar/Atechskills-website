import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sms/Sidebar";
import Topbar from "../../components/sms/Topbar";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/sms-dashboard.css";

const MyCourse = () => {
  const { user, token } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  useEffect(() => {
    if (!user?.selectedCourse) return;
    fetch(`/api/sms/courses/${user.selectedCourse._id || user.selectedCourse}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setCourse);
  }, [user, token]);

  if (!user) return null;

  return (
    <div className="sms-dashboard-bg">
      <Sidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="My Course" batch={user?.batch} />
        {course && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ background: 'linear-gradient(90deg,#6B21A8,#7C3AED)', borderRadius: '1.2rem', color: '#fff', padding: '2rem 2.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>{course.name}</h2>
              <div style={{ fontWeight: 500, margin: '0.5rem 0' }}>{course.track} • {course.bootcampType === 'short' ? 'Short Bootcamp' : 'Complete Bootcamp'}</div>
              <div style={{ display: 'flex', gap: '2.5rem', marginTop: '1rem' }}>
                <span>Duration: {course.duration}</span>
                <span>Mode: {course.mode}</span>
                <span>Batch: {course.batchNo}</span>
                <span>Start: {course.startDate ? new Date(course.startDate).toLocaleDateString() : '-'}</span>
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#6B21A8' }}>Syllabus</h3>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {(course.syllabus || []).map((topic, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem', color: '#F8FAFC' }}>Week {i + 1}: {topic}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#1E1B2E', borderRadius: '0.8rem', padding: '1.2rem', color: '#F8FAFC', border: '1.5px solid #2D2A40', maxWidth: 400 }}>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>Instructor</div>
              <div>{course.instructorName || '-'}</div>
              <div style={{ color: '#94A3B8', fontSize: '0.98rem' }}>{course.instructorDesignation || ''}</div>
              <div style={{ color: '#94A3B8', fontSize: '0.98rem' }}>{course.instructorEmail || ''}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourse;
