"use client"

import { useState } from "react"
import axios from "axios"
import Badge from "../badges/Badge"
import "./styles/TaskBadgeForm.css"

const AVAILABLE_BADGES = ["Completed", "On Time", "Star Performer", "Important", "Review"]

const TaskBadgeForm = ({ taskId, onSuccess, onCancel }) => {
    const [selectedBadge, setSelectedBadge] = useState(AVAILABLE_BADGES[0])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            await axios.post(`/tasks/${taskId}/badge`, { badgeName: selectedBadge })
            setIsSubmitting(false)
            onSuccess()
        } catch (err) {
            setError(err.response?.data?.message || "Error adding badge")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="badge-form-container">
            <h3 className="badge-form-title">Add Badge to Task</h3>
            {error && <div className="badge-form-error">{error}</div>}

            <form onSubmit={handleSubmit} className="badge-form">
                <div className="badge-selection">
                    <label className="form-label">Select Badge:</label>
                    <div className="badges-grid">
                        {AVAILABLE_BADGES.map((badge) => (
                            <div
                                key={badge}
                                className={`badge-option ${selectedBadge === badge ? "selected" : ""}`}
                                onClick={() => setSelectedBadge(badge)}
                            >
                                <Badge name={badge} size="medium" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="badge-preview">
                    <label className="form-label">Preview:</label>
                    <div className="preview-badge">
                        <Badge name={selectedBadge} size="large" />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="cancel-btn" disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Badge"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TaskBadgeForm
