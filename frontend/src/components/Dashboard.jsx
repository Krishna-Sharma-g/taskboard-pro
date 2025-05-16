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
    return <div>Loading projects...</div>
  }

  return (
    <div>
      <div style={styles.header}>
        <h1>My Projects</h1>
        <Link to="/projects/new" style={styles.createButton}>
          Create Project
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {projects.length === 0 ? (
        <div style={styles.noProjects}>
          <p>You don't have any projects yet.</p>
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
                <span>Members: {project.members.length}</span>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  createButton: {
    padding: "8px 16px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
  noProjects: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  linkButton: {
    display: "inline-block",
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#4a6ee0",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
  },
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  projectTitle: {
    marginBottom: "10px",
  },
  projectDescription: {
    color: "#666",
    marginBottom: "15px",
  },
  projectMeta: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "15px",
  },
  viewButton: {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    textDecoration: "none",
    borderRadius: "4px",
  },
}

export default Dashboard
