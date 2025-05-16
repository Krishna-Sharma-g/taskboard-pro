"use client"

import Badge from "../badges/Badge"

const AutomationList = ({ automations, onDelete, isOwner }) => {
  const getTriggerDescription = (automation) => {
    const { type, condition } = automation.trigger

    if (type === "status_change") {
      return `When task status changes to "${condition.status}"`
    } else if (type === "assignee_change") {
      return `When task is assigned to a user`
    } else if (type === "due_date_passed") {
      return `When task due date passes`
    }

    return "Unknown trigger"
  }

  const getActionDescription = (automation) => {
    const { type, value } = automation.action

    if (type === "change_status") {
      return `Change task status to "${value.status}"`
    } else if (type === "assign_user") {
      return `Assign task to a user`
    } else if (type === "add_badge") {
      return (
          <div style={styles.badgeAction}>
            Add badge: <Badge name={value.badge} />
          </div>
      )
    }

    return "Unknown action"
  }

  if (automations.length === 0) {
    return <div style={styles.emptyState}>No automations created yet.</div>
  }

  return (
      <div style={styles.automationList}>
        {automations.map((automation) => (
            <div key={automation._id} style={styles.automationCard}>
              <div style={styles.automationFlow}>
                <div style={styles.triggerSection}>
                  <div style={styles.triggerIcon}>⚡</div>
                  <div style={styles.triggerContent}>
                    <div style={styles.sectionTitle}>Trigger</div>
                    <div style={styles.triggerDescription}>{getTriggerDescription(automation)}</div>
                  </div>
                </div>

                <div style={styles.flowArrow}>➔</div>

                <div style={styles.actionSection}>
                  <div style={styles.actionIcon}>🔄</div>
                  <div style={styles.actionContent}>
                    <div style={styles.sectionTitle}>Action</div>
                    <div style={styles.actionDescription}>{getActionDescription(automation)}</div>
                  </div>
                </div>
              </div>

              {isOwner && (
                  <button onClick={() => onDelete(automation._id)} style={styles.deleteButton}>
                    Delete
                  </button>
              )}
            </div>
        ))}
      </div>
  )
}

const styles = {
  automationList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 0",
    color: "#7f8c8d",
    fontSize: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    border: "1px dashed #ddd",
  },
  automationCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    border: "1px solid #f0f0f0",
  },
  automationFlow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  triggerSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flex: "1",
    minWidth: "250px",
    backgroundColor: "#f7f9fa",
    padding: "15px",
    borderRadius: "8px",
  },
  triggerIcon: {
    backgroundColor: "#ffeaa7",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  triggerContent: {
    flex: "1",
  },
  flowArrow: {
    color: "#7f8c8d",
    fontSize: "24px",
    padding: "0 5px",
  },
  actionSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flex: "1",
    minWidth: "250px",
    backgroundColor: "#f0f7fa",
    padding: "15px",
    borderRadius: "8px",
  },
  actionIcon: {
    backgroundColor: "#cce5ff",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  actionContent: {
    flex: "1",
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  triggerDescription: {
    color: "#2c3e50",
    fontSize: "15px",
    fontWeight: "500",
  },
  actionDescription: {
    color: "#2c3e50",
    fontSize: "15px",
    fontWeight: "500",
  },
  deleteButton: {
    alignSelf: "flex-end",
    padding: "8px 16px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  badgeAction: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
}

export default AutomationList
