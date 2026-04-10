
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/sms-login.css";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Pass role to login (if backend supports), otherwise check after login
    const result = await login(email, password);
    if (result.success) {
      // Use selected role for redirect
      if (role === "admin") navigate("/sms/admin-dashboard");
      else if (role === "instructor") navigate("/sms/instructor-dashboard");
      else navigate("/sms/student-dashboard");
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="sms-login-bg">
      <div className="sms-login-card">
        <div className="sms-logo">ATech Skills</div>
        <div className="sms-portal-label">Student Portal</div>
        {error && <div className="sms-login-error">{error}</div>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="sms-login-input-wrapper">
            <select
              className="sms-login-input"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              style={{ marginBottom: 10 }}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <div className="sms-login-input-wrapper">
            <input
              className="sms-login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="sms-login-input-wrapper">
            <input
              className="sms-login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span
              className="sms-eye-toggle"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={0}
              role="button"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button className="sms-login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
