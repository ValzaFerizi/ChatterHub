import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../api/api";

function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
  const [appName, setAppName] = useState('Formify')
  const [appTagline, setAppTagline] = useState('Forms + Sheets')

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data.app_name) setAppName(res.data.app_name)
      if (res.data.app_tagline) setAppTagline(res.data.app_tagline)
    }).catch(() => {})
  }, [])

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>{appName}</h2>
        <p>{appTagline}</p>
      </div>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/forms">Forms</NavLink>
        <NavLink to="/sheets">Sheets</NavLink>
        <NavLink to="/create-form">Create Form</NavLink>
        <NavLink to="/search">Search</NavLink>

        {isAdmin && (
          <>
            <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "8px 0" }} />
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/audit">Audit Logs</NavLink>
            <NavLink to="/cms-settings">CMS Settings</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;