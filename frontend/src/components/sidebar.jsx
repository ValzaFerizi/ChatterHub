import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.isAdmin

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Formify</h2>
        <p>Forms + Sheets</p>
      </div>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/forms">Forms</NavLink>
        <NavLink to="/sheets">Sheets</NavLink>
        <NavLink to="/create-form">Create Form</NavLink>
        {isAdmin && (
          <>
            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/audit">Audit Logs</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
