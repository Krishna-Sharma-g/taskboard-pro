"use client"

import { useState } from "react"
import "./styles/InviteForm.css"

const InviteForm = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email is required")
      return
    }

    onSubmit(email)
  }

  return (
      <div className="invite-overlay">
        <div className="invite-modal">
          <h2 className="invite-title">Invite User</h2>
          {error && <div className="invite-error">{error}</div>}
          <form onSubmit={handleSubmit} className="invite-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                User Email
              </label>
              <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter user email"
                  required
              />
            </div>
            <div className="invite-actions">
              <button type="button" onClick={onCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Invite
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}

export default InviteForm
