"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import BadgesList from "./badges/BadgesList"

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const [showBadges, setShowBadges] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleBadges = () => {
    setShowBadges(!showBadges)
  }

  return (
      <nav style={styles.navbar}>
        <div style={styles.container}>
          <Link to="/" style={styles.logo}>
            TaskBoard Pro
          </Link>
          <div style={styles.rightSection}>
            {isAuthenticated ? (
                <>
                  <div style={styles.userSection}>
                    <span style={styles.username}>Hello, {user?.name}</span>
                    {user?.badges && user.badges.length > 0 && (
                        <button onClick={toggleBadges} style={styles.badgesButton}>
                          Badges ({user.badges.length})
                        </button>
                    )}
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                      Logout
                    </button>
                  </div>
                  {showBadges && user?.badges && user.badges.length > 0 && (
                      <div style={styles.badgesDropdown}>
                        <h4 style={styles.badgesTitle}>Your Badges</h4>
                        <div style={styles.badgesList}>
                          {user.badges.map((badge, index) => (
                              <div key={`user-badge-${index}`} style={styles.badgeItem}>
                                <div style={styles.badgeName}>
                                  <BadgesList badges={[badge]} size="medium" />
                                </div>
                                <div style={styles.badgeProject}>
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
                  <Link to="/login" style={styles.navLink}>
                    Login
                  </Link>
                  <Link to="/register" style={styles.navLink}>
                    Register
                  </Link>
                </>
            )}
          </div>
        </div>
      </nav>
  )
}

const styles = {
  navbar: {
    backgroundColor: "#2c3e50",
    color: "#fff",
    padding: "12px 0",
    position: "relative",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.8rem",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
  },
  rightSection: {
    position: "relative",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "20px",
    padding: "8px 15px",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
    fontWeight: "500",
  },
  username: {
    fontSize: "16px",
    fontWeight: "500",
  },
  badgesButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logoutBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.95rem",
    padding: "8px 15px",
    borderRadius: "4px",
    transition: "all 0.3s ease",
  },
  badgesDropdown: {
    position: "absolute",
    top: "calc(100% + 15px)",
    right: "0",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.15)",
    padding: "18px",
    zIndex: "100",
    minWidth: "280px",
    maxWidth: "320px",
  },
  badgesTitle: {
    margin: "0 0 15px 0",
    color: "#2c3e50",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    fontSize: "18px",
  },
  badgesList: {
    maxHeight: "350px",
    overflowY: "auto",
  },
  badgeItem: {
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  badgeName: {
    marginBottom: "6px",
  },
  badgeProject: {
    fontSize: "13px",
    color: "#777",
    fontStyle: "italic",
  },
}

export default Navbar
