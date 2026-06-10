import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

function Navbar() {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const navigate = useNavigate();

  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const handleLogout = async () => {
    if (logout) await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <input
        placeholder="Search forms, sheets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user && (
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            {user.first_name} {user.last_name}
          </span>
        )}

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 16px",
            background: "#6d28d9",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;