"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./styles/Dashboard.css"

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
    return (
        <div className="loading-container">
          <div className="loader-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p className="loading-text">Loading your projects...</p>
        </div>
    )
  }

  return (
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">My Projects</h1>
            <Link to="/projects/new" className="btn btn-primary create-project-btn">
              <span className="btn-icon">+</span>
              Create Project
            </Link>
          </div>

          {error && <div className="error-alert">{error}</div>}

          {projects.length === 0 ? (
              <div className="empty-projects">
                <div className="empty-icon">📋</div>
                <p className="empty-text">You don't have any projects yet.</p>
                <Link to="/projects/new" className="btn btn-primary">
                  Create your first project
                </Link>
              </div>
          ) : (
              <div className="project-grid">
                {projects.map((project, index) => (
                    <div key={project._id} className="project-card slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="project-card-content">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">{project.description || "No description"}</p>
                        <div className="project-meta">
                    <span className="member-count">
                      <span className="meta-icon">👥</span> {project.members.length} members
                    </span>
                          <span className="date-created">
                      <span className="meta-icon">📅</span>{" "}
                            {new Date(project.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                    </span>
                        </div>
                      </div>
                      <Link to={`/projects/${project._id}`} className="project-view-btn">
                        View Project
                      </Link>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  )
}

export default Dashboard
