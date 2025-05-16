"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const { email, password } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const result = await login(formData)

    if (result === true) {
      navigate("/")
    } else {
      setError(result.error)
    }
  }

  return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.headerSection}>
            <h1 style={styles.title}>Login</h1>
            <p style={styles.subtitle}>Sign in to TaskBoard Pro</p>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={onSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  style={styles.input}
                  placeholder="Enter your email"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  style={styles.input}
                  placeholder="Enter your password"
              />
            </div>
            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account?{" "}
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 120px)",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "450px",
    padding: "35px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#2c3e50",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#7f8c8d",
    margin: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "22px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#2c3e50",
    fontSize: "15px",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  button: {
    padding: "14px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
    boxShadow: "0 4px 10px rgba(52, 152, 219, 0.25)",
    marginTop: "10px",
  },
  error: {
    color: "#e74c3c",
    backgroundColor: "#fadbd8",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
  },
  footerText: {
    color: "#7f8c8d",
    fontSize: "14px",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "600",
  },
}

export default Login
