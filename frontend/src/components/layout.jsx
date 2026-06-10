import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useLayoutStore } from "../store/useLayoutStore";

function Layout() {
  const sidebarOpen = useLayoutStore((state) => state.sidebarOpen);
  const closeSidebar = useLayoutStore((state) => state.closeSidebar);

  return (
    <div className="app-layout">
      <div className={sidebarOpen ? "sidebar-mobile-open" : ""}>
        <Sidebar />
      </div>

      {sidebarOpen && (
        <button
          className="mobile-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}

      <main className="main">
        <Navbar />

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;