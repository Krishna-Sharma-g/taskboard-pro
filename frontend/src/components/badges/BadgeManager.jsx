"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Badge from "./Badge"
import "./styles/BadgeManager.css"

const BadgeManager = ({ projectId }) => {
    const [badges, setBadges] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [stats, setStats] = useState({})

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                // Get all tasks for the project
                const tasksRes = await axios.get(`/tasks/project/${projectId}`)
                const tasks = tasksRes.data

                // Extract all badges from tasks
                const allBadges = []
                const badgeCounts = {}
                const userBadges = {}

                tasks.forEach((task) => {
                    if (task.badges && task.badges.length > 0) {
                        task.badges.forEach((badge) => {
                            allBadges.push({
                                ...badge,
                                taskId: task._id,
                                taskTitle: task.title,
                            })

                            // Count badges by type
                            badgeCounts[badge.name] = (badgeCounts[badge.name] || 0) + 1

                            // Count badges by user
                            if (task.assignee) {
                                const userId = task.assignee._id
                                const userName = task.assignee.name

                                if (!userBadges[userId]) {
                                    userBadges[userId] = {
                                        name: userName,
                                        count: 0,
                                        badges: {},
                                    }
                                }

                                userBadges[userId].count++
                                userBadges[userId].badges[badge.name] = (userBadges[userId].badges[badge.name] || 0) + 1
                            }
                        })
                    }
                })

                setBadges(allBadges)
                setStats({
                    badgeCounts,
                    userBadges: Object.values(userBadges).sort((a, b) => b.count - a.count),
                })
                setLoading(false)
            } catch (err) {
                setError("Error fetching badges: " + (err.response?.data?.message || err.message))
                setLoading(false)
            }
        }

        if (projectId) {
            fetchBadges()
        }
    }, [projectId])

    if (loading) {
        return <div className="badge-manager-loading">Loading badges...</div>
    }

    if (error) {
        return <div className="badge-manager-error">{error}</div>
    }

    if (badges.length === 0) {
        return (
            <div className="badge-manager-empty">
                <div className="empty-icon">🏆</div>
                <p>No badges have been awarded in this project yet.</p>
                <p className="empty-hint">Add badges to tasks to recognize achievements!</p>
            </div>
        )
    }

    return (
        <div className="badge-manager">
            <div className="badge-stats">
                <h3 className="stats-title">Badge Statistics</h3>

                <div className="stats-section">
                    <h4 className="section-title">Badges by Type</h4>
                    <div className="badge-counts">
                        {Object.entries(stats.badgeCounts).map(([name, count]) => (
                            <div key={name} className="badge-count-item">
                                <Badge name={name} />
                                <span className="badge-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {stats.userBadges && stats.userBadges.length > 0 && (
                    <div className="stats-section">
                        <h4 className="section-title">Top Badge Earners</h4>
                        <div className="user-badges-list">
                            {stats.userBadges.slice(0, 5).map((user, index) => (
                                <div key={index} className="user-badge-item">
                                    <div className="user-info">
                                        <div className="user-rank">{index + 1}</div>
                                        <div className="user-name">{user.name}</div>
                                        <div className="user-badge-count">{user.count} badges</div>
                                    </div>
                                    <div className="user-badges">
                                        {Object.entries(user.badges).map(([badgeName, count]) => (
                                            <div key={badgeName} className="user-badge-type">
                                                <Badge name={badgeName} size="small" />
                                                <span className="badge-count">×{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="recent-badges">
                <h3 className="recent-title">Recently Awarded Badges</h3>
                <div className="recent-badges-list">
                    {badges.slice(0, 10).map((badge, index) => (
                        <div key={index} className="recent-badge-item">
                            <Badge name={badge.name} size="medium" />
                            <div className="badge-details">
                                <div className="badge-task">Task: {badge.taskTitle}</div>
                                <div className="badge-date">Awarded: {new Date(badge.awardedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BadgeManager
