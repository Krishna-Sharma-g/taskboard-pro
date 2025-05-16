"use client"

import { useState } from "react"
import "./styles/TaskForm.css"

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
      <div className="task-form-container">
        <h3 className="form-title">{task ? "Edit Task" : "Create New Task"}</h3>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                className="form-input"
                placeholder="Enter task title"
                required
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
                rows="3"
                placeholder="Enter task description (optional)"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input type="date" id="dueDate" name="dueDate" value={dueDate} onChange={onChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select id="status" name="status" value={status} onChange={onChange} className="form-select">
                {project.statuses.map((s, index) => (
                    <option key={`status-${index}`} value={s}>
                      {s}
                    </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assigneeId" className="form-label">
              Assignee
            </label>
            <select id="assigneeId" name="assigneeId" value={assigneeId} onChange={onChange} className="form-select">
              <option value="">Unassigned</option>
              {project.members &&
                  project.members.map((member) => (
                      <option key={member._id || `member-${Math.random()}`} value={member._id}>
                        {member.name || "Unknown User"}
                      </option>
                  ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
  )
}

export default TaskForm
