"use client"

import { useState } from "react"
import BadgesList from "../badges/BadgesList"
import "./TaskList.css"

const TaskList = ({ tasks, statuses, onStatusChange, onDelete, onAddBadge, members }) => {
  const [draggingTask, setDraggingTask] = useState(null)
  const [dragOverStatus, setDragOverStatus] = useState(null)

  // Group tasks by status
  const tasksByStatus = {}
  statuses.forEach((status) => {
    tasksByStatus[status] = tasks.filter((task) => task.status === status)
  })

  const handleStatusChange = (taskId, newStatus) => {
    onStatusChange(taskId, { status: newStatus })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getAssigneeName = (assignee) => {
    if (!assignee) return "Unassigned"
    return assignee.name || "Unknown User"
  }

  // Drag and drop handlers
  const handleDragStart = (task) => {
    setDraggingTask(task)
  }

  const handleDragOver = (e, status) => {
    e.preventDefault()
    setDragOverStatus(status)
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    if (draggingTask && draggingTask.status !== status) {
      handleStatusChange(draggingTask._id, status)
    }
    setDraggingTask(null)
    setDragOverStatus(null)
  }

  const handleDragEnd = () => {
    setDraggingTask(null)
    setDragOverStatus(null)
  }

  // Add a new function to handle adding badges to a task
  const handleAddBadge = (taskId) => {
    // This function will be implemented in the ProjectDetails component
    if (onAddBadge) {
      onAddBadge(taskId)
    }
  }

  return (
      <div className="kanban-board">
        {statuses.map((status, statusIndex) => {
          const isOver = dragOverStatus === status

          return (
              <div
                  key={`status-${statusIndex}`}
                  className={`kanban-column ${status.toLowerCase().replace(/\s+/g, "-")} ${isOver ? "column-over" : ""}`}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDrop={(e) => handleDrop(e, status)}
              >
                <div className={`kanban-column-header ${status.toLowerCase().replace(/\s+/g, "-")}-header`}>
                  <span className="status-name">{status}</span>
                  <span className="task-count">{tasksByStatus[status].length}</span>
                </div>
                <div className="task-list">
                  {tasksByStatus[status].map((task, taskIndex) => (
                      <div
                          key={task._id || `task-${Math.random()}`}
                          className="task-card"
                          style={{ animationDelay: `${taskIndex * 0.05}s` }}
                          draggable
                          onDragStart={() => handleDragStart(task)}
                          onDragEnd={handleDragEnd}
                      >
                        <div className="task-title">{task.title}</div>
                        {task.description && <div className="task-description">{task.description}</div>}

                        {task.badges && task.badges.length > 0 && (
                            <div className="task-badges">
                              <BadgesList badges={task.badges} />
                            </div>
                        )}

                        <div className="task-meta">
                          <div className="task-due-date">
                            <span className="meta-label">Due:</span> {formatDate(task.dueDate)}
                          </div>
                          <div className="task-assignee">
                            <span className="meta-label">Assignee:</span> {getAssigneeName(task.assignee)}
                          </div>
                        </div>
                        <div className="task-actions">
                          <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              className="status-select"
                          >
                            {statuses.map((s, i) => (
                                <option key={`option-${task._id}-${i}`} value={s}>
                                  Move to {s}
                                </option>
                            ))}
                          </select>
                          <button onClick={() => handleAddBadge(task._id)} className="badge-button" title="Add Badge">
                            🏆
                          </button>
                          <button onClick={() => onDelete(task._id)} className="delete-button">
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}
                  {tasksByStatus[status].length === 0 && (
                      <div className="empty-column">
                        <p className="empty-text">No tasks</p>
                        <p className="drag-hint">Drag tasks here</p>
                      </div>
                  )}
                </div>
              </div>
          )
        })}
      </div>
  )
}

export default TaskList
