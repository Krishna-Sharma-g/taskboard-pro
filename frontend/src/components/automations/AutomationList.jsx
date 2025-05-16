"use client"

import Badge from "../badges/Badge"
import "./styles/AutomationList.css"

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
          <div className="badge-action">
            Add badge: <Badge name={value.badge} />
          </div>
      )
    }

    return "Unknown action"
  }

  if (automations.length === 0) {
    return <div className="empty-state">No automations created yet.</div>
  }

  return (
      <div className="automation-list">
        {automations.map((automation) => (
            <div key={automation._id} className="automation-card">
              <div className="automation-flow">
                <div className="trigger-section">
                  <div className="trigger-icon">⚡</div>
                  <div className="trigger-content">
                    <div className="section-title">Trigger</div>
                    <div className="trigger-description">{getTriggerDescription(automation)}</div>
                  </div>
                </div>

                <div className="flow-arrow">➔</div>

                <div className="action-section">
                  <div className="action-icon">🔄</div>
                  <div className="action-content">
                    <div className="section-title">Action</div>
                    <div className="action-description">{getActionDescription(automation)}</div>
                  </div>
                </div>
              </div>

              {isOwner && (
                  <button onClick={() => onDelete(automation._id)} className="delete-button">
                    Delete
                  </button>
              )}
            </div>
        ))}
      </div>
  )
}

export default AutomationList
