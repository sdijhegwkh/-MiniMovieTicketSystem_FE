import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") ?? "null");
  const isAuth = !!user;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Decorative top line */}
      <div className="navbar-topline" />

      {/* Logo */}
      <Link to="/movies" className="navbar-logo">
        <span className="navbar-logo-eye">Premium Cinema</span>
        <span className="navbar-logo-title">CINEMAX</span>
      </Link>

      {/* Links */}
      <div className="navbar-links">
        <Link
          to="/movies"
          className={`navbar-link ${location.pathname === "/movies" ? "active" : ""}`}
        >
          <span className="navbar-link-inner">PHIM</span>
        </Link>

        {isAuth && (
          <Link
            to="/my-tickets"
            className={`navbar-link ${location.pathname === "/my-tickets" ? "active" : ""}`}
          >
            <span className="navbar-link-inner">VÉ CỦA TÔI</span>
          </Link>
        )}

        {!isAuth ? (
          <>
            <Link
              to="/login"
              className={`navbar-link ${location.pathname === "/login" ? "active" : ""}`}
            >
              <span className="navbar-link-inner">ĐĂNG NHẬP</span>
            </Link>
            <Link to="/register" className="navbar-cta">
              ĐĂNG KÝ
            </Link>
          </>
        ) : (
          <>
            <span className="navbar-user">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {user.username ?? "User"}
            </span>
            <button className="navbar-logout" onClick={handleLogout}>
              ĐĂNG XUẤT
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
