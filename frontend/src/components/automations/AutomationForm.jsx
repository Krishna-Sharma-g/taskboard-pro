"use client"

import { useState } from "react"

const styles = {
  formContainer: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  formTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid red",
    borderRadius: "4px",
    backgroundColor: "#ffebee",
  },
  section: {
    marginBottom: "20px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  sectionIcon: {
    fontSize: "20px",
    marginRight: "10px",
    color: "#555",
  },
  sectionTitle: {
    fontSize: "18px",
    color: "#444",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontSize: "16px",
    marginBottom: "5px",
    color: "#555",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "#333",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage:
        "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M7%2E41%208%2E59L12%2013%2E17l4%2E59-4%2E58L18%2010l-6%206-6-6%207%2E41-1%2E41z%22/%3E%3C/svg%3E')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px top 50%",
    backgroundSize: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#4a7bff",
    color: "white",
    padding: "12px 20px",
    fontSize: "18px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#355bb7",
    },
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
    padding: "12px 20px",
    fontSize: "18px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginRight: "10px",
    ":hover": {
      backgroundColor: "#999",
    },
  },
  buttonContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
}

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
      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>Create Automation</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>⚡</div>
              <h4 style={styles.sectionTitle}>When this happens (Trigger):</h4>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="triggerType" style={styles.label}>
                Trigger Type
              </label>
              <select
                  id="triggerType"
                  value={formData.triggerType}
                  onChange={handleTriggerTypeChange}
                  style={styles.select}
              >
                <option value="status_change">Task status changes</option>
                <option value="assignee_change">Task is assigned to someone</option>
                <option value="due_date_passed">Task due date passes</option>
              </select>
            </div>

            {formData.triggerType === "status_change" && (
                <div style={styles.formGroup}>
                  <label htmlFor="status" style={styles.label}>
                    Status
                  </label>
                  <select
                      id="status"
                      name="status"
                      value={formData.triggerCondition.status}
                      onChange={handleTriggerConditionChange}
                      style={styles.select}
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
                <div style={styles.formGroup}>
                  <label htmlFor="userId" style={styles.label}>
                    Assigned To
                  </label>
                  <select
                      id="userId"
                      name="userId"
                      value={formData.triggerCondition.userId}
                      onChange={handleTriggerConditionChange}
                      style={styles.select}
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
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>⚙️</div>
              <h4 style={styles.sectionTitle}>Then do this (Action):</h4>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="actionType" style={styles.label}>
                Action Type
              </label>
              <select id="actionType" value={formData.actionType} onChange={handleActionTypeChange} style={styles.select}>
                <option value="change_status">Change task status</option>
                <option value="assign_user">Assign user to task</option>
                <option value="add_badge">Add badge to task</option>
              </select>
            </div>

            {formData.actionType === "change_status" && (
                <div style={styles.formGroup}>
                  <label htmlFor="status" style={styles.label}>
                    New Status
                  </label>
                  <select
                      id="status"
                      name="status"
                      value={formData.actionValue.status}
                      onChange={handleActionValueChange}
                      style={styles.select}
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
                <div style={styles.formGroup}>
                  <label htmlFor="userId" style={styles.label}>
                    Assign To
                  </label>
                  <select
                      id="userId"
                      name="userId"
                      value={formData.actionValue.userId}
                      onChange={handleActionValueChange}
                      style={styles.select}
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
                <div style={styles.formGroup}>
                  <label htmlFor="badge" style={styles.label}>
                    Badge
                  </label>
                  <select
                      id="badge"
                      name="badge"
                      value={formData.actionValue.badge}
                      onChange={handleActionValueChange}
                      style={styles.select}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Important">Important</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
            )}
          </div>

          <div style={styles.buttonContainer}>
            <button type="button" style={styles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Create Automation
            </button>
          </div>
        </form>
      </div>
  )
}

export default AutomationForm
