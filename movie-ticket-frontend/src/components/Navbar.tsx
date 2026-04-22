import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav style={{ display: "flex", gap: 10 }}>
      <Link to="/">Movies</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
};

export default Navbar;