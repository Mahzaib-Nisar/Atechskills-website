import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sms/Sidebar";
import Topbar from "../../components/sms/Topbar";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle, FaClipboardList, FaChartBar, FaBookOpen, FaClock } from "react-icons/fa";
import "../../styles/sms-dashboard.css";

const StudentDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.enrollmentStatus !== "enrolled") {
      navigate("/sms/enrollment-status");
      return;
    }
    // Fetch dashboard data (replace with real API)
    fetch("/api/sms/dashboard/overview", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setDashboard);
  }, [user, token, navigate]);

  if (!user || user.enrollmentStatus !== "enrolled") return null;

  return (
    <div className="sms-dashboard-bg">
      <Sidebar />
      <main className="sms-dashboard-main">
        <Topbar breadcrumb="Dashboard" batch={dashboard?.batchNo || user?.batch} />
        <div className="sms-dashboard-cards">
          <div className="sms-dashboard-stat-card">
            <div className="sms-dashboard-stat-title">Course Enrolled</div>
            <div className="sms-dashboard-stat-value">{dashboard?.courseName || "-"}</div>
            <div className="sms-dashboard-stat-badge sms-dashboard-badge-muted">{dashboard?.track || "-"}</div>
          </div>
          <div className="sms-dashboard-stat-card">
            <div className="sms-dashboard-stat-title">Fee Status</div>
            <div className="sms-dashboard-stat-value">
              {dashboard?.feeStatus === "approved" ? (
                <span className="sms-dashboard-stat-badge sms-dashboard-badge-green">Paid & Approved</span>
              ) : (
                <span className="sms-dashboard-stat-badge sms-dashboard-badge-amber">Pending</span>
              )}
            </div>
          </div>
          <div className="sms-dashboard-stat-card">
            <div className="sms-dashboard-stat-title">Pending Assignments</div>
            <div className="sms-dashboard-stat-value">{dashboard?.pendingAssignments?.count || 0}</div>
            <div className="sms-dashboard-stat-badge sms-dashboard-badge-amber">
              {dashboard?.pendingAssignments?.nextDue ? `Due: ${dashboard.pendingAssignments.nextDue}` : "No Pending"}
            </div>
          </div>
          <div className="sms-dashboard-stat-card">
            <div className="sms-dashboard-stat-title">Results</div>
            <div className="sms-dashboard-stat-value">
              {dashboard?.resultsAvailable ? (
                <span className="sms-dashboard-stat-badge sms-dashboard-badge-green">Available</span>
              ) : (
                <span className="sms-dashboard-stat-badge sms-dashboard-badge-muted">Not Yet</span>
              )}
            </div>
          </div>
        </div>
        <div className="sms-dashboard-info-row">
          <div>
            <div className="sms-dashboard-info-label">Batch</div>
            <div className="sms-dashboard-info-value">{dashboard?.batchNo || user?.batch || "-"}</div>
          </div>
          <div>
            <div className="sms-dashboard-info-label">Start Date</div>
            <div className="sms-dashboard-info-value">{dashboard?.startDate ? new Date(dashboard.startDate).toLocaleDateString() : "-"}</div>
          </div>
          <div>
            <div className="sms-dashboard-info-label">Instructor</div>
            <div className="sms-dashboard-info-value">{dashboard?.instructorName || "-"}</div>
          </div>
        </div>
        <div className="sms-dashboard-activity-feed">
          <div className="sms-dashboard-activity-title">Recent Activity</div>
          <ul className="sms-dashboard-activity-list">
            {(dashboard?.activityFeed || []).map((item, idx) => (
              <li className="sms-dashboard-activity-item" key={idx}>
                <span className="sms-dashboard-activity-icon">{getActivityIcon(item.type)}</span>
                {item.text}
              </li>
            ))}
            {(!dashboard?.activityFeed || dashboard.activityFeed.length === 0) && (
              <li className="sms-dashboard-activity-item">No recent activity.</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

function getActivityIcon(type) {
  switch (type) {
    case "assignment": return <FaClipboardList />;
    case "result": return <FaChartBar />;
    case "fee": return <FaBookOpen />;
    case "approved": return <FaCheckCircle style={{ color: '#10B981' }} />;
    case "pending": return <FaExclamationCircle style={{ color: '#fbbf24' }} />;
    case "time": return <FaClock />;
    default: return <FaClipboardList />;
  }
}

export default StudentDashboard;
