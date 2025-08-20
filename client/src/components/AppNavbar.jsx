import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const userName = user ? user.name : "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
    if (menuOpen) setDropdownOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => setDropdownOpen((open) => !open);

  return (
    <>
      <nav className="navbar-pro sticky top-0 z-50">
        <div className="navbar-container">
          {/* Brand */}
          <div className="navbar-brand flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 no-underline"
              style={{ textDecoration: "none" }}
            >
              <span
                className="navbar-logo flex items-center justify-center text-white font-extrabold text-2xl rounded-full bg-indigo-600 shadow-md"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                R
              </span>
              <span className="navbar-title font-semibold text-lg tracking-wide text-indigo-800">
                rhythm of heart
              </span>
            </Link>
          </div>
          <nav className="navbar-links-desktop flex items-center gap-6 ml-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "navbar-link font-medium text-gray-700 hover:text-indigo-700 transition" +
                (isActive ? " navbar-link-active" : "")
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                "navbar-link font-medium text-gray-700 hover:text-indigo-700 transition" +
                (isActive ? " navbar-link-active" : "")
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/artists"
              className={({ isActive }) =>
                "navbar-link font-medium text-gray-700 hover:text-indigo-700 transition" +
                (isActive ? " navbar-link-active" : "")
              }
            >
              Artists
            </NavLink>
            <NavLink
              to="/posts"
              className={({ isActive }) =>
                "navbar-link font-medium text-gray-700 hover:text-indigo-700 transition" +
                (isActive ? " navbar-link-active" : "")
              }
            >
              Posts
            </NavLink>
          </nav>
          <div className="navbar-actions">
            {/* {isLoggedIn && (
              <NavLink
                to={user && user.isPerformer ? "/artist/profile" : "/my-profile"}
                className={({ isActive }) =>
                  "navbar-link hide-on-mobile" +
                  (isActive ? " navbar-link-active" : "")
                }
              >
                Profile
              </NavLink>
            )} */}
            {isLoggedIn ? (
              <div className="relative group">
                <button className="navbar-user-btn" onClick={toggleDropdown}>
                  <span className="navbar-avatar">{userName.charAt(0)}</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <Link
                      to={user && user.isAdmin ? "/admin/dashboard" : user.isPerformer ? "/artist/profile" : "/my-profile"}
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-100"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                        navigate('/');
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    "navbar-link hide-on-mobile" +
                    (isActive ? " navbar-link-active" : "")
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    "navbar-link hide-on-mobile" +
                    (isActive ? " navbar-link-active" : "")
                  }
                >
                  Register
                </NavLink>
              </>
            )}
            {/* Hamburger (Mobile) */}
            <button
              className="navbar-hamburger"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={menuOpen ? "open" : ""}></span>
              <span className={menuOpen ? "open" : ""}></span>
              <span className={menuOpen ? "open" : ""}></span>
            </button>
          </div>
        </div>
        {/* Off-canvas Mobile Menu */}
        {menuOpen && (
          <div className="navbar-mobile-overlay" onClick={closeMenu}>
            <div
              className="navbar-mobile-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="navbar-mobile-header">
                <span className="navbar-logo">R</span>
                <span className="navbar-title">rhythm of heart</span>
                <button
                  className="navbar-mobile-close"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>
              <div className="navbar-mobile-links">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "navbar-link" + (isActive ? " navbar-link-active" : "")
                  }
                  end
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    "navbar-link" + (isActive ? " navbar-link-active" : "")
                  }
                  onClick={closeMenu}
                >
                  Events
                </NavLink>
                <NavLink
                  to="/artists"
                  className={({ isActive }) =>
                    "navbar-link" + (isActive ? " navbar-link-active" : "")
                  }
                  onClick={closeMenu}
                >
                  Artists
                </NavLink>
                <NavLink
                  to="/posts"
                  className={({ isActive }) =>
                    "navbar-link" + (isActive ? " navbar-link-active" : "")
                  }
                  onClick={closeMenu}
                >
                  Posts
                </NavLink>
              </div>
              <div className="navbar-mobile-user mt-6">
                {isLoggedIn ? (
                  <>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-rose-100"
                      onClick={() => {
                        logout();
                        closeMenu();
                        navigate('/');
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        "navbar-link" + (isActive ? " navbar-link-active" : "")
                      }
                      onClick={closeMenu}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        "navbar-link" + (isActive ? " navbar-link-active" : "")
                      }
                      onClick={closeMenu}
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <style>{`
.navbar-pro {
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 18px 0 #6366f11a, 0 1.5px 0 #e0e7ff inset;
  border-bottom: 2px solid #e0e7ff;
  transition: box-shadow 0.18s, background 0.18s;
}
.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  padding: 0 2rem;
  position: relative;
}
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.navbar-logo {
  background: #6366f1;
  color: #fff;
  font-weight: 900;
  font-size: 1.3rem;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px 0 #6366f11a;
  letter-spacing: 0.05em;
}
.navbar-title {
  font-size: 1.18rem;
  font-weight: 700;
  color: #3730a3;
  letter-spacing: 0.04em;
}
.navbar-links-desktop {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}
.navbar-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.08rem;
  position: relative;
  background: transparent;
  border-radius: 0.8rem;
  padding: 0.5rem 1.2rem;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.12s;
  outline: none;
  letter-spacing: 0.02em;
  display: inline-block;
  border: 1px solid transparent;
}
.navbar-link::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: #6366f1;
  border-radius: 2px;
  transition: width 0.18s;
  margin-top: 2px;
}
.navbar-link:hover {
  background: #e0e7ff;
  color: #3730a3;
  box-shadow: 0 3px 12px #a5b4fc22, 0 1px 6px #fbcfe822;
  transform: translateY(-2px) scale(1.05);
  border: 1px solid #a5b4fc;
}
.navbar-link:hover::after {
  width: 100%;
}
.navbar-link-active {
  background: #ede9fe;
  color: #3730a3;
  font-weight: 700;
  border: 1px solid #a5b4fc;
  box-shadow: 0 2px 8px #a5b4fc22;
}
.navbar-link-active::after {
  width: 100%;
  background: linear-gradient(90deg, #a78bfa, #6366f1);
  opacity: 0.7;
}
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.navbar-avatar {
  background: #a5b4fc;
  color: #3730a3;
  font-weight: 800;
  font-size: 1.08rem;
  border-radius: 50%;
  width: 1.7rem;
  height: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.1rem;
  box-shadow: 0 1px 4px #a5b4fc22;
  border: 1px solid #e0e7ff;
}
.navbar-user-btn {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  font: inherit;
  padding: 0;
}
.user-dropdown {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 8.5rem;
  background: #fff;
  border-radius: 0.6rem;
  box-shadow: 0 4px 16px #6366f13a;
  padding: 0.3rem 0;
  opacity: 1;
  z-index: 50;
}
.group:not(:hover) .user-dropdown {
  display: none;
}
/* Hamburger */
.navbar-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2.2rem;
  height: 2.2rem;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 60;
  margin-left: 0.5rem;
}
.navbar-hamburger span {
  display: block;
  width: 1.6rem;
  height: 3px;
  background: #6366f1;
  margin: 3px 0;
  border-radius: 2px;
  transition: all 0.3s;
}
.navbar-hamburger span.open:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.navbar-hamburger span.open:nth-child(2) {
  opacity: 0;
}
.navbar-hamburger span.open:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}
/* Off-canvas Mobile Menu */
.navbar-mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30,41,59,0.18);
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}
.navbar-mobile-menu {
  background: #fff;
  width: 85vw;
  max-width: 340px;
  min-height: 100vh;
  box-shadow: -4px 0 32px #6366f13a;
  border-top-left-radius: 1.2rem;
  border-bottom-left-radius: 1.2rem;
  padding: 1.2rem 1.2rem 2rem 1.2rem;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.25s cubic-bezier(.4,2,.6,1) both;
}
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.navbar-mobile-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
  justify-content: space-between;
}
.navbar-mobile-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6366f1;
  cursor: pointer;
  margin-left: auto;
  line-height: 1;
}
.navbar-mobile-links {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.navbar-mobile-user {
  border-top: 1px solid #e0e7ff;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
@media (max-width: 1100px) {
  .navbar-container {
    padding: 0 0.7rem;
  }
}
@media (max-width: 900px) {
  .navbar-links-desktop {
    display: none;
  }
  .navbar-hamburger {
    display: flex;
  }
  .hide-on-mobile {
    display: none !important;
  }
}
@media (min-width: 901px) {
  .navbar-mobile-overlay {
    display: none !important;
  }
  .navbar-hamburger {
    display: none !important;
  }
  .navbar-links-desktop {
    display: flex !important;
  }
}
.hide-on-mobile {
  display: inline-block;
}`}</style>
    </>
  );
};

export default AppNavbar;
