"use client"

import { useState } from "react"
import "./styles/AutomationForm.css"

const AutomationForm = ({ onSubmit, onCancel, project }) => {
  const [formData, setFormData] = useState({
    triggerType: "status_change",
    triggerCondition: {
      status: project.statuses[0],
    },
    actionType: "change_status",
    actionValue: {
      status: project.statuses[0],
    },
  })
  const [error, setError] = useState("")

  const handleTriggerTypeChange = (e) => {
    const triggerType = e.target.value
    let triggerCondition = {}

    if (triggerType === "status_change") {
      triggerCondition = { status: project.statuses[0] }
    } else if (triggerType === "assignee_change") {
      triggerCondition = { userId: project.members[0]?._id || "" }
    } else if (triggerType === "due_date_passed") {
      triggerCondition = {}
    }

    setFormData({
      ...formData,
      triggerType,
      triggerCondition,
    })
  }

  const handleTriggerConditionChange = (e) => {
    setFormData({
      ...formData,
      triggerCondition: {
        ...formData.triggerCondition,
        [e.target.name]: e.target.value,
      },
    })
  }

  const handleActionTypeChange = (e) => {
    const actionType = e.target.value
    let actionValue = {}

    if (actionType === "change_status") {
      actionValue = { status: project.statuses[0] }
    } else if (actionType === "assign_user") {
      actionValue = { userId: project.members[0]?._id || "" }
    } else if (actionType === "add_badge") {
      actionValue = { badge: "Completed" }
    }

    setFormData({
      ...formData,
      actionType,
      actionValue,
    })
  }

  const handleActionValueChange = (e) => {
    setFormData({
      ...formData,
      actionValue: {
        ...formData.actionValue,
        [e.target.name]: e.target.value,
      },
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    const { triggerType, triggerCondition, actionType, actionValue } = formData

    onSubmit({
      trigger: {
        type: triggerType,
        condition: triggerCondition,
      },
      action: {
        type: actionType,
        value: actionValue,
      },
    })
  }

  return (
      <div className="automation-form-container">
        <h3 className="automation-form-title">Create Automation</h3>
        {error && <div className="automation-form-error">{error}</div>}
        <form onSubmit={handleSubmit} className="automation-form">
          <div className="automation-section">
            <div className="section-header">
              <div className="section-icon">⚡</div>
              <h4 className="section-title">When this happens (Trigger):</h4>
            </div>

            <div className="form-group">
              <label htmlFor="triggerType" className="form-label">
                Trigger Type
              </label>
              <select
                  id="triggerType"
                  value={formData.triggerType}
                  onChange={handleTriggerTypeChange}
                  className="form-select"
              >
                <option value="status_change">Task status changes</option>
                <option value="assignee_change">Task is assigned to someone</option>
                <option value="due_date_passed">Task due date passes</option>
              </select>
            </div>

            {formData.triggerType === "status_change" && (
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                      id="status"
                      name="status"
                      value={formData.triggerCondition.status}
                      onChange={handleTriggerConditionChange}
                      className="form-select"
                  >
                    {project.statuses.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                    ))}
                  </select>
                </div>
            )}

            {formData.triggerType === "assignee_change" && (
                <div className="form-group">
                  <label htmlFor="userId" className="form-label">
                    Assigned To
                  </label>
                  <select
                      id="userId"
                      name="userId"
                      value={formData.triggerCondition.userId}
                      onChange={handleTriggerConditionChange}
                      className="form-select"
                  >
                    {project.members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                    ))}
                  </select>
                </div>
            )}
          </div>

          {/* Action Section */}
          <div className="automation-section">
            <div className="section-header">
              <div className="section-icon">⚙️</div>
              <h4 className="section-title">Then do this (Action):</h4>
            </div>

            <div className="form-group">
              <label htmlFor="actionType" className="form-label">
                Action Type
              </label>
              <select
                  id="actionType"
                  value={formData.actionType}
                  onChange={handleActionTypeChange}
                  className="form-select"
              >
                <option value="change_status">Change task status</option>
                <option value="assign_user">Assign user to task</option>
                <option value="add_badge">Add badge to task</option>
              </select>
            </div>

            {formData.actionType === "change_status" && (
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    New Status
                  </label>
                  <select
                      id="status"
                      name="status"
                      value={formData.actionValue.status}
                      onChange={handleActionValueChange}
                      className="form-select"
                  >
                    {project.statuses.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                    ))}
                  </select>
                </div>
            )}

            {formData.actionType === "assign_user" && (
                <div className="form-group">
                  <label htmlFor="userId" className="form-label">
                    Assign To
                  </label>
                  <select
                      id="userId"
                      name="userId"
                      value={formData.actionValue.userId}
                      onChange={handleActionValueChange}
                      className="form-select"
                  >
                    {project.members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                    ))}
                  </select>
                </div>
            )}

            {formData.actionType === "add_badge" && (
                <div className="form-group">
                  <label htmlFor="badge" className="form-label">
                    Badge
                  </label>
                  <select
                      id="badge"
                      name="badge"
                      value={formData.actionValue.badge}
                      onChange={handleActionValueChange}
                      className="form-select"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Important">Important</option>
                    <option value="Review">Review</option>
                    <option value="Star Performer">Star Performer</option>
                    <option value="On Time">On Time</option>
                  </select>
                </div>
            )}
          </div>

          <div className="automation-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Automation
            </button>
          </div>
        </form>
      </div>
  )
}

export default AutomationForm
