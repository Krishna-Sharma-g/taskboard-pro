"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/projects")
        setProjects(res.data)
        setLoading(false)
      } catch (err) {
        setError("Error fetching projects")
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <div style={styles.loading}>Loading projects...</div>
  }

  return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Projects</h1>
          <Link to="/projects/new" style={styles.createButton}>
            Create Project
          </Link>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {projects.length === 0 ? (
            <div style={styles.noProjects}>
              <p style={styles.noProjectsText}>You don't have any projects yet.</p>
              <Link to="/projects/new" style={styles.linkButton}>
                Create your first project
              </Link>
            </div>
        ) : (
            <div style={styles.projectGrid}>
              {projects.map((project) => (
                  <div key={project._id} style={styles.projectCard}>
                    <h3 style={styles.projectTitle}>{project.title}</h3>
                    <p style={styles.projectDescription}>{project.description || "No description"}</p>
                    <div style={styles.projectMeta}>
                <span style={styles.memberCount}>
                  <i style={styles.icon}>👥</i> {project.members.length} members
                </span>
                    </div>
                    <Link to={`/projects/${project._id}`} style={styles.viewButton}>
                      View Project
                    </Link>
                  </div>
              ))}
            </div>
        )}
      </div>
  )
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "32px",
    color: "#2c3e50",
    margin: "0",
    fontWeight: "600",
  },
  createButton: {
    padding: "12px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    boxShadow: "0 2px 8px rgba(52, 152, 219, 0.3)",
    transition: "all 0.3s ease",
  },
  error: {
    color: "#e74c3c",
    backgroundColor: "#fadbd8",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#7f8c8d",
  },
  noProjects: {
    textAlign: "center",
    padding: "60px 40px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
  },
  noProjectsText: {
    fontSize: "20px",
    color: "#7f8c8d",
    marginBottom: "25px",
  },
  linkButton: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#3498db",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    boxShadow: "0 2px 8px rgba(52, 152, 219, 0.3)",
    transition: "all 0.3s ease",
  },
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
  },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    padding: "25px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    border: "1px solid #f0f0f0",
    display: "flex",
    flexDirection: "column",
  },
  projectTitle: {
    fontSize: "20px",
    color: "#2c3e50",
    marginBottom: "12px",
    fontWeight: "600",
  },
  projectDescription: {
    color: "#7f8c8d",
    marginBottom: "20px",
    fontSize: "15px",
    lineHeight: "1.5",
    flexGrow: 1,
  },
  projectMeta: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "20px",
  },
  memberCount: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  icon: {
    fontSize: "16px",
    fontStyle: "normal",
  },
  viewButton: {
    display: "inline-block",
    padding: "10px 16px",
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    textAlign: "center",
    border: "1px solid #e9ecef",
    transition: "all 0.2s ease",
  },
}

export default Dashboard
