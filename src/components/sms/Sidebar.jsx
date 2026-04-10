import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaTachometerAlt, FaBook, FaFileInvoice, FaTasks, FaChartBar, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../../styles/sms-dashboard.css";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const initials = user?.name?.split(" ").map(n => n[0]).join("") || "S";
  const courseName = user?.selectedCourse?.name || "-";

  return (
    <aside className="sms-sidebar">
      <div className="sms-sidebar-logo">ATech Skills</div>
      <div className="sms-sidebar-portal">Student Portal</div>
      <div className="sms-sidebar-avatar">{initials}</div>
      <div className="sms-sidebar-student">
        <div className="sms-sidebar-student-name">{user?.name}</div>
        <div className="sms-sidebar-student-course">{courseName}</div>
      </div>
      <nav className="sms-sidebar-nav">
        <NavLink to="/sms/dashboard" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"} end>
          <FaTachometerAlt className="sms-sidebar-link-icon" /> Dashboard
        </NavLink>
        <NavLink to="/sms/my-course" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaBook className="sms-sidebar-link-icon" /> My Course
        </NavLink>
        <NavLink to="/sms/fee-challan" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaFileInvoice className="sms-sidebar-link-icon" /> Fee Challan
        </NavLink>
        <NavLink to="/sms/assignments" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaTasks className="sms-sidebar-link-icon" /> Assignments
        </NavLink>
        <NavLink to="/sms/results" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaChartBar className="sms-sidebar-link-icon" /> My Results
        </NavLink>
        <NavLink to="/sms/profile" className={({ isActive }) => isActive ? "sms-sidebar-link active" : "sms-sidebar-link"}>
          <FaUser className="sms-sidebar-link-icon" /> Profile
        </NavLink>
      </nav>
      <button className="sms-sidebar-logout" onClick={logout}>
        <FaSignOutAlt className="sms-sidebar-link-icon" /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
