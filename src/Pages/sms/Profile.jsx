import React, { useContext, useState } from "react";
import Sidebar from "../../components/sms/Sidebar";
import Topbar from "../../components/sms/Topbar";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/sms-dashboard.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    cnic: user?.cnic || "",
    emergencyContact: user?.emergencyContact || ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const [passwords, setPasswords] = useState({ old: "", new: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePicChange = e => setProfilePic(e.target.files[0]);
  const handlePasswordChange = e => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  // Add submit handlers for profile and password update as needed

  return (
    <div className="sms-dashboard-bg">
      <Sidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="Profile" batch={user?.batch} />
        <h2 style={{ color: '#F8FAFC', marginBottom: '1.5rem' }}>My Profile</h2>
        <form style={{ background: '#1E1B2E', borderRadius: '1.1rem', border: '1.5px solid #2D2A40', padding: '2rem', maxWidth: 500 }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ color: '#94A3B8', fontWeight: 600 }}>Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ color: '#94A3B8', fontWeight: 600 }}>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ color: '#94A3B8', fontWeight: 600 }}>CNIC</label>
            <input name="cnic" value={form.cnic} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ color: '#94A3B8', fontWeight: 600 }}>Emergency Contact</label>
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ color: '#94A3B8', fontWeight: 600 }}>Profile Picture</label>
            <input type="file" onChange={handlePicChange} style={{ color: '#F8FAFC' }} />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ color: '#94A3B8', fontWeight: 600 }}>Change Password</label>
            <input name="old" type="password" placeholder="Old Password" value={passwords.old} onChange={handlePasswordChange} style={inputStyle} />
            <input name="new" type="password" placeholder="New Password" value={passwords.new} onChange={handlePasswordChange} style={inputStyle} />
          </div>
          <div style={{ color: '#94A3B8', fontSize: '0.98rem', marginBottom: '1.2rem' }}>
            <b>Email:</b> {user?.email}<br />
            <b>Student ID:</b> {user?.studentId}<br />
            <b>Course:</b> {user?.selectedCourse?.name || '-'}<br />
            <b>Batch:</b> {user?.batch}<br />
            <b>Enrollment Date:</b> {user?.enrollmentDate ? new Date(user.enrollmentDate).toLocaleDateString() : '-'}
          </div>
          <button type="button" style={{ background: 'linear-gradient(90deg,#6B21A8,#7C3AED)', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Update Profile</button>
        </form>
      </main>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  background: '#0F172A',
  color: '#F8FAFC',
  border: '1.5px solid #2D2A40',
  borderRadius: '0.7rem',
  padding: '0.7rem 1rem',
  marginTop: '0.3rem',
  marginBottom: '0.3rem',
  fontSize: '1rem',
};

export default Profile;
