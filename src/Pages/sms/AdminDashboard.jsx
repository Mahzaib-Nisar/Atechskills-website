import React from "react";
import Sidebar from "../../components/sms/Sidebar";
import Topbar from "../../components/sms/Topbar";

const AdminDashboard = () => (
  <div className="sms-dashboard">
    <Topbar />
    <div className="sms-dashboard-content">
      <Sidebar />
      <main>
        <h2>Admin Dashboard</h2>
        <p>Manage students, courses, and system settings here.</p>
      </main>
    </div>
  </div>
);

export default AdminDashboard;
