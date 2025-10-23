import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();

  const linkCls = ({ isActive }) =>
    `text-sm font-medium transition-opacity duration-200 ${
      isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
    }`;

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm border-b shadow-sm"
      style={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",color: "white" }}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold transition-opacity hover:opacity-80"
          style={{  }}
        >
          ClubHub
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/clubs" className={linkCls} style={{ color: "var(--text-color)" }}>
            Clubs
          </NavLink>
          <NavLink to="/events" className={linkCls} style={{ color: "var(--text-color)" }}>
            Events
          </NavLink>
         
            {user && <NavLink to="/feed" className={linkCls}>Feed</NavLink>}
            <NavLink to="/announcements" className={linkCls}>Announcements</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkCls} style={{ color: "var(--text-color)" }}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <NavLink
                to="/login"
                className="text-sm transition-opacity hover:opacity-80"
                style={{ color: "var(--text-color)" }}
              >
                Login
              </NavLink>
              <Button
                as={Link}
                to="/register"
                className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <span
                className="text-sm opacity-90"
                style={{ color: "var(--text-color)" }}
              >
                Hi, {user.name.split(" ")[0]}
              </span>
              <Button
                className="px-4 py-2 ml-4 rounded-md text-sm bg-dark hover:opacity-90 transition-opacity"
                style={{
                 bgColor:" #6a11cb",
                  
                }}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Placeholder */}
        {/* If needed later, you can add a Hamburger icon here */}
      </nav>
    </header>
  );
}
