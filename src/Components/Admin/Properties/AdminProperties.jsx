/**
 * AdminPage.jsx
 *
 * Wraps the Sidebar + AdminDashboard together.
 * When the sidebar's "View Properties" item is selected,
 * the AdminDashboard opens directly on the "All Properties" tab.
 *
 * NAV_ITEMS in NavConfig should include:
 *   { id: "properties", label: "View Properties", icon: <BuildingIcon /> }
 *
 * The id "overview" maps to the dashboard overview tab.
 * The id "properties" maps to the All Properties tab.
 */

import { useState, useEffect } from "react";
import Sidebar from "./Navbar";
import AdminDashboard from "./Admindashboard";

const NAV_TO_TAB = {
  dashboard:  "overview",
  overview:   "overview",
  properties: "properties",
};

export default function AdminPage() {
  const [activeNavId, setActiveNavId] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar on nav selection (mobile)
  const handleSelect = (id) => {
    setActiveNavId(id);
    if (isMobile) setSidebarOpen(false);
  };

  const dashboardTab = NAV_TO_TAB[activeNavId] ?? "overview";

  return (
    <>
      <style>{`
        /* Reset box-sizing globally for this layout */
        .admin-page-root *, .admin-page-root *::before, .admin-page-root *::after {
          box-sizing: border-box;
        }

        .admin-page-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #f5f7fb;
          position: relative;
        }

        /* Sidebar: fixed on desktop, slide-in drawer on mobile */
        .admin-sidebar-wrapper {
          width: 240px;
          flex-shrink: 0;
          height: 100vh;
          position: relative;
          z-index: 200;
        }

        /* Mobile hamburger button */
        .menu-toggle {
          display: none;
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 300;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #1a56db;
          border: none;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(26,86,219,0.4);
          flex-direction: column;
          gap: 5px;
          padding: 10px;
        }
        .menu-toggle span {
          display: block;
          width: 100%;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: all .25s;
        }

        /* Backdrop (mobile only) */
        .sidebar-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 150;
          background: rgba(7,20,34,0.5);
          backdrop-filter: blur(2px);
          -webkit-tap-highlight-color: transparent;
        }

        /* Main content area */
        .admin-main {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── Responsive ── */

        /* Tablet: narrower sidebar */
        @media (max-width: 900px) {
          .admin-sidebar-wrapper { width: 200px; }
        }

        /* Mobile: sidebar becomes a drawer */
        @media (max-width: 768px) {
          .admin-sidebar-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
            transition: transform .3s cubic-bezier(.22,1,.36,1);
            width: 260px;
          }
          .admin-sidebar-wrapper.open {
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(11,26,46,0.18);
          }
          .sidebar-backdrop { display: block; }
          .sidebar-backdrop.visible { opacity: 1; pointer-events: auto; }
          .sidebar-backdrop:not(.visible) { opacity: 0; pointer-events: none; transition: opacity .3s; }
          .menu-toggle { display: flex; }
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>

      <div className="admin-page-root">

        {/* ── Hamburger button (mobile) ── */}
        {isMobile && (
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <span style={{ transform: sidebarOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: sidebarOpen ? 0 : 1 }} />
            <span style={{ transform: sidebarOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        )}

        {/* ── Backdrop (mobile) ── */}
        {isMobile && (
          <div
            className={`sidebar-backdrop${sidebarOpen ? " visible" : ""}`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <div className={`admin-sidebar-wrapper${sidebarOpen ? " open" : ""}`}>
          <Sidebar activeId={activeNavId} onSelect={handleSelect} />
        </div>

        {/* ── Main content ── */}
        <main
          className="admin-main"
          style={{ marginLeft: isMobile ? 0 : undefined }}
        >
          <AdminDashboard initialTab={dashboardTab} />
        </main>
      </div>
    </>
  );
}