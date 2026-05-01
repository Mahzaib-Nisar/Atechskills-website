import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaTachometerAlt, FaUserCheck, FaUsers, FaFileInvoice, FaBook, FaTasks, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../../styles/sms-dashboard.css";

const AdminSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const initials = user?.name?.split(" ").map(n => n[0]).join("") || "A";

  return (
    <aside className="sms-sidebar">
      <div className="sms-sidebar-logo">ATech Skills</div>
      <div style={{ color: '#F43F5E', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.5rem' }}>Admin Panel</div>
      <div className="sms-sidebar-avatar">{initials}</div>
      <div className="sms-sidebar-student">
        <div className="sms-sidebar-student-name">{user?.name || 'Admin'}</div>
        <div className="sms-sidebar-student-course" style={{ color: '#F43F5E' }}>Administrator</div>
      </div>
      <nav className="sms-sidebar-nav">
        <NavLink to="/sms/admin" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"} end>
          <FaTachometerAlt className="sms-sidebar-link-icon" /> Overview
        </NavLink>
        <NavLink to="/sms/admin/approvals" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaUserCheck className="sms-sidebar-link-icon" /> Pending Approvals
        </NavLink>
        <NavLink to="/sms/admin/students" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaUsers className="sms-sidebar-link-icon" /> All Students
        </NavLink>
        <NavLink to="/sms/admin/fees" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaFileInvoice className="sms-sidebar-link-icon" /> Fee Management
        </NavLink>
        <NavLink to="/sms/admin/courses" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaBook className="sms-sidebar-link-icon" /> Courses & Batches
        </NavLink>
        <NavLink to="/sms/admin/assignments" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaTasks className="sms-sidebar-link-icon" /> Assignments
        </NavLink>
        <NavLink to="/sms/admin/results" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaChartBar className="sms-sidebar-link-icon" /> Results
        </NavLink>
        <NavLink to="/sms/admin/settings" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaCog className="sms-sidebar-link-icon" /> Settings
        </NavLink>
      </nav>
      <button className="sms-sidebar-logout" onClick={logout}>
        <FaSignOutAlt className="sms-sidebar-link-icon" /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
