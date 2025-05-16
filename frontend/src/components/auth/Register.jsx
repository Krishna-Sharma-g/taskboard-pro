"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Auth.css"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const { name, email, password, password2 } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== password2) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    const result = await register({
      name,
      email,
      password,
    })
    setIsLoading(false)

    if (result === true) {
      navigate("/")
    } else {
      setError(result.error)
    }
  }

  return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <span className="auth-logo-icon">📋</span>
                <h1 className="auth-title">TaskBoard Pro</h1>
              </div>
              <p className="auth-subtitle">Create your account</p>
            </div>

            {error && (
                <div className="auth-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                    className="form-control"
                    placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="form-control"
                    placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="form-control"
                    placeholder="Enter your password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password2" className="form-label">
                  Confirm Password
                </label>
                <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="form-control"
                    placeholder="Confirm your password"
                />
              </div>
              <button type="submit" className={`auth-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <div className="auth-footer">
              <p className="auth-footer-text">
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Register
