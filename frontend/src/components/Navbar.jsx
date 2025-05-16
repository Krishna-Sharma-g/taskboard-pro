"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import BadgesList from "./badges/BadgesList"
import "./styles/Navbar.css"

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showBadges, setShowBadges] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleBadges = () => {
    setShowBadges(!showBadges)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-icon">📋</span>
            <span className="navbar-logo-text">TaskBoard Pro</span>
          </Link>

          {/* Mobile Menu Button */}
          <button className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
            <div className={`menu-bar ${mobileMenuOpen ? "bar-top" : ""}`}></div>
            <div className={`menu-bar ${mobileMenuOpen ? "bar-middle" : ""}`}></div>
            <div className={`menu-bar ${mobileMenuOpen ? "bar-bottom" : ""}`}></div>
          </button>

          {/* Navigation Links */}
          <div className={`navbar-links ${mobileMenuOpen ? "show" : ""}`}>
            {isAuthenticated ? (
                <>
                  <div className="navbar-user">
                    <span className="navbar-username">Hello, {user?.name}</span>
                    {user?.badges && user.badges.length > 0 && (
                        <button onClick={toggleBadges} className="navbar-badges-btn">
                          <span className="badge-icon">🏆</span>
                          <span>Badges ({user.badges.length})</span>
                        </button>
                    )}
                    <button onClick={handleLogout} className="navbar-logout-btn">
                      Logout
                    </button>
                  </div>
                  {showBadges && user?.badges && user.badges.length > 0 && (
                      <div className="navbar-badges-dropdown">
                        <h4 className="badges-title">Your Badges</h4>
                        <div className="badges-list">
                          {user.badges.map((badge, index) => (
                              <div key={`user-badge-${index}`} className="badge-item">
                                <div className="badge-name">
                                  <BadgesList badges={[badge]} size="medium" />
                                </div>
                                <div className="badge-project">
                                  {badge.project ? `Project: ${badge.project.title || "Unknown"}` : ""}
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </>
            ) : (
                <>
                  <Link to="/login" className="navbar-link">
                    Login
                  </Link>
                  <Link to="/register" className="navbar-link">
                    Register
                  </Link>
                </>
            )}
          </div>
        </div>
      </nav>
  )
}

export default Navbar
