import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const navItems = [
    { to: "/home", label: "Dashboard", icon: "▦" },
    { to: "/purchase-entry", label: "Purchase Entry", icon: "＋" },
    { to: "/report", label: "Reports", icon: "▤" },
  ];

  return (
    <header className="topbar">
      <button className="brand-button" onClick={() => navigate("/home")} aria-label="Go to dashboard">
        <span className="brand-mark">▦</span>
        <span><strong>IMS</strong><small>Inventory Management System</small></span>
      </button>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </NavLink>
        ))}
      </nav>
      <div className="user-area"><span className="avatar">A</span><span>Admin</span><button className="logout-link" onClick={() => navigate("/login")}>Log out</button></div>
    </header>
  );
}
