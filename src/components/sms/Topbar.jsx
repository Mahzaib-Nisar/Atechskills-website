import React from "react";
import { FaBell } from "react-icons/fa";
import "../../styles/sms-dashboard.css";

const Topbar = ({ breadcrumb, batch }) => (
  <div className="sms-dashboard-topbar">
    <div className="sms-dashboard-breadcrumb">{breadcrumb}</div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FaBell className="sms-dashboard-notify" />
      {batch && <span className="sms-dashboard-batch-badge">Batch {batch}</span>}
    </div>
  </div>
);

export default Topbar;
