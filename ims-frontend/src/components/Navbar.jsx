// import { NavLink } from "react-router-dom";

// function Navbar() {
//   return (
//     <header className="app-header">

//       <div className="app-title">
//         INVENTORY MANAGEMENT SYSTEM
//       </div>

//       <nav className="navbar">

//         <NavLink
//           to="/home"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           Home
//         </NavLink>

//         <NavLink
//           to="/purchase-entry"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           Purchase Entry
//         </NavLink>

//         <NavLink
//           to="/report"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           Reports
//         </NavLink>

//       </nav>

//     </header>
//   );
// }

// export default Navbar;

import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="app-header">

      <div className="app-title">
        INVENTORY MANAGEMENT SYSTEM
      </div>

      <nav className="navbar">

        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/purchase-entry"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Purchase Entry
        </NavLink>

        <NavLink
          to="/report"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Reports
        </NavLink>

        <button
          type="button"
          className="nav-link logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

    </header>
  );
}

export default Navbar;