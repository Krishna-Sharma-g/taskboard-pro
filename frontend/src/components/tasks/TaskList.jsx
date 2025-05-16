"use client"

import BadgesList from "../badges/BadgesList"

const TaskList = ({ tasks, statuses, onStatusChange, onDelete, members }) => {
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

  // Get appropriate status color
  const getStatusColor = (status) => {
    const colors = {
      "To Do": { bg: "#f8f9fa", header: "#e9ecef", text: "#495057" },
      "In Progress": { bg: "#e6f7ff", header: "#bae7ff", text: "#0958d9" },
      Done: { bg: "#f6ffed", header: "#d9f7be", text: "#389e0d" },
      // Default colors for custom statuses
      default: { bg: "#f5f5f5", header: "#e0e0e0", text: "#757575" },
    }

    return colors[status] || colors.default
  }

  return (
      <div style={styles.kanbanBoard}>
        {statuses.map((status, statusIndex) => {
          const statusColors = getStatusColor(status)

          return (
              <div
                  key={`status-${statusIndex}`}
                  style={{
                    ...styles.kanbanColumn,
                    backgroundColor: statusColors.bg,
                  }}
              >
                <div
                    style={{
                      ...styles.kanbanColumnHeader,
                      backgroundColor: statusColors.header,
                      color: statusColors.text,
                    }}
                >
                  {status} ({tasksByStatus[status].length})
                </div>
                <div style={styles.taskList}>
                  {tasksByStatus[status].map((task) => (
                      <div key={task._id || `task-${Math.random()}`} style={styles.taskCard}>
                        <div style={styles.taskTitle}>{task.title}</div>
                        {task.description && <div style={styles.taskDescription}>{task.description}</div>}

                        {task.badges && task.badges.length > 0 && (
                            <div style={styles.badgesContainer}>
                              <BadgesList badges={task.badges} />
                            </div>
                        )}

                        <div style={styles.taskMeta}>
                          <div style={styles.dueDate}>
                            <span style={styles.metaLabel}>Due:</span> {formatDate(task.dueDate)}
                          </div>
                          <div style={styles.assignee}>
                            <span style={styles.metaLabel}>Assignee:</span> {getAssigneeName(task.assignee)}
                          </div>
                        </div>
                        <div style={styles.taskActions}>
                          <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              style={styles.statusSelect}
                          >
                            {statuses.map((s, i) => (
                                <option key={`option-${task._id}-${i}`} value={s}>
                                  Move to {s}
                                </option>
                            ))}
                          </select>
                          <button onClick={() => onDelete(task._id)} style={styles.deleteButton}>
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )
        })}
      </div>
  )
}

const styles = {
  kanbanBoard: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "20px",
    minHeight: "400px",
  },
  kanbanColumn: {
    minWidth: "300px",
    maxWidth: "320px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #eaeaea",
    flex: "1",
  },
  kanbanColumnHeader: {
    fontWeight: "600",
    padding: "15px 20px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    fontSize: "16px",
    letterSpacing: "0.3px",
  },
  taskList: {
    padding: "15px",
    overflowY: "auto",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  taskTitle: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#2c3e50",
    marginBottom: "2px",
  },
  taskDescription: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
  },
  badgesContainer: {
    marginTop: "5px",
  },
  taskMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontSize: "13px",
    color: "#666",
    marginTop: "5px",
  },
  dueDate: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  assignee: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  metaLabel: {
    fontWeight: "600",
    color: "#444",
  },
  taskActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    gap: "10px",
  },
  statusSelect: {
    flex: "1",
    padding: "8px 10px",
    fontSize: "13px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 12px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
}

export default TaskList
