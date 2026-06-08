import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />

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