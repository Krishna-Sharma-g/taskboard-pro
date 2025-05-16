"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./styles/CreateProject.css"

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const { title, description } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await axios.post("/projects", formData)
      navigate(`/projects/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Error creating project")
    }
  }

  return (
      <div className="create-project-page">
        <div className="create-project-container">
          <div className="create-project-card">
            <h1 className="create-project-title">Create New Project</h1>
            {error && <div className="create-project-error">{error}</div>}
            <form onSubmit={onSubmit} className="create-project-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Project Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={onChange}
                    required
                    className="form-input"
                    placeholder="Enter project title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={onChange}
                    className="form-textarea"
                    rows="4"
                    placeholder="Enter project description (optional)"
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => navigate("/")} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}

export default CreateProject
