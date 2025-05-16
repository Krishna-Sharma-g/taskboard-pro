"use client"

import { useState } from "react"

const TaskForm = ({ onSubmit, onCancel, project, task }) => {
  const [formData, setFormData] = useState({
    title: task ? task.title : "",
    description: task ? task.description : "",
    dueDate: task && task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    status: task ? task.status : project.statuses[0],
    assigneeId: task && task.assignee ? task.assignee._id : "",
  })
  const [error, setError] = useState("")

  const { title, description, dueDate, status, assigneeId } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!title) {
      setError("Title is required")
      return
    }

    onSubmit(formData)
  }

  return (
      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>{task ? "Edit Task" : "Create New Task"}</h3>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              Title
            </label>
            <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                style={styles.input}
                placeholder="Enter task title"
                required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>
              Description
            </label>
            <textarea
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                style={styles.textarea}
                rows="3"
                placeholder="Enter task description (optional)"
            ></textarea>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="dueDate" style={styles.label}>
                Due Date
              </label>
              <input type="date" id="dueDate" name="dueDate" value={dueDate} onChange={onChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="status" style={styles.label}>
                Status
              </label>
              <select id="status" name="status" value={status} onChange={onChange} style={styles.select}>
                {project.statuses.map((s, index) => (
                    <option key={`status-${index}`} value={s}>
                      {s}
                    </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="assigneeId" style={styles.label}>
              Assignee
            </label>
            <select id="assigneeId" name="assigneeId" value={assigneeId} onChange={onChange} style={styles.select}>
              <option value="">Unassigned</option>
              {project.members &&
                  project.members.map((member) => (
                      <option key={member._id || `member-${Math.random()}`} value={member._id}>
                        {member.name || "Unknown User"}
                      </option>
                  ))}
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" onClick={onCancel} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
  )
}

const styles = {
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
  },
  formTitle: {
    margin: "0 0 20px 0",
    color: "#2c3e50",
    fontSize: "20px",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: "20px",
    width: "100%",
  },
  formRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "0",
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
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  textarea: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "100px",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    appearance: "none",
    backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 15px center",
    backgroundSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "10px",
  },
  cancelButton: {
    padding: "12px 20px",
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(52, 152, 219, 0.25)",
  },
  error: {
    color: "#e74c3c",
    backgroundColor: "#fadbd8",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },
}

export default TaskForm
