import { NavLink } from "react-router-dom";

function Sidebar() {
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
      </nav>
    </aside>
  );
}

export default Sidebar;