"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import TaskList from "../tasks/TaskList"
import TaskForm from "../tasks/TaskForm"
import InviteForm from "./InviteForm"
import AutomationList from "../automations/AutomationList"
import AutomationForm from "../automations/AutomationForm"
import BadgesList from "../badges/BadgesList"
import Loader from "../common/Loader"
import { useAuth } from "../../context/AuthContext"
import "./styles/ProjectDetails.css"
// Add import for TaskBadgeForm
import TaskBadgeForm from "../tasks/TaskBadgeForm"
// Add import for BadgeManager
import BadgeManager from "../badges/BadgeManager"

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [automations, setAutomations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [showAutomationForm, setShowAutomationForm] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")
  // Add state for badge form
  const [showBadgeForm, setShowBadgeForm] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project details
        const projectRes = await axios.get(`/projects/${id}`)
        setProject(projectRes.data)

        // Fetch tasks
        const tasksRes = await axios.get(`/tasks/project/${id}`)
        setTasks(tasksRes.data)

        // Fetch automations
        const automationsRes = await axios.get(`/automations/project/${id}`)
        setAutomations(automationsRes.data)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching project data:", err)
        setError("Error fetching project data: " + (err.response?.data?.message || err.message))
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [id])

  const handleTaskCreate = async (taskData) => {
    try {
      const res = await axios.post("/tasks", {
        ...taskData,
        projectId: id,
      })
      setTasks([...tasks, res.data])
      setShowTaskForm(false)
    } catch (err) {
      console.error("Error creating task:", err)
      setError("Error creating task: " + (err.response?.data?.message || err.message))
    }
  }

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      const res = await axios.put(`/tasks/${taskId}`, updatedData)
      setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)))
    } catch (err) {
      setError("Error updating task: " + (err.response?.data?.message || err.message))
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter((task) => task._id !== taskId))
    } catch (err) {
      setError("Error deleting task: " + (err.response?.data?.message || err.message))
    }
  }

  const handleInviteUser = async (email) => {
    try {
      const res = await axios.post(`/projects/${id}/invite`, { email })
      setProject(res.data)
      setShowInviteForm(false)
    } catch (err) {
      setError(err.response?.data?.message || "Error inviting user")
    }
  }

  const handleAutomationCreate = async (automationData) => {
    try {
      const res = await axios.post("/automations", {
        ...automationData,
        projectId: id,
      })
      setAutomations([...automations, res.data])
      setShowAutomationForm(false)
    } catch (err) {
      setError("Error creating automation: " + (err.response?.data?.message || err.message))
    }
  }

  const handleAutomationDelete = async (automationId) => {
    try {
      await axios.delete(`/automations/${automationId}`)
      setAutomations(automations.filter((automation) => automation._id !== automationId))
    } catch (err) {
      setError("Error deleting automation: " + (err.response?.data?.message || err.message))
    }
  }

  // Get member badges for this project
  const getMemberBadges = (member) => {
    if (!member || !member.badges) return []
    return member.badges.filter((badge) => badge.project && badge.project.toString() === id)
  }

  // Add handler for badge button click
  const handleAddBadge = (taskId) => {
    setSelectedTaskId(taskId)
    setShowBadgeForm(true)
  }

  // Add handler for badge form success
  const handleBadgeSuccess = () => {
    setShowBadgeForm(false)
    setSelectedTaskId(null)

    // Refresh tasks
    const fetchTasks = async () => {
      try {
        const tasksRes = await axios.get(`/tasks/project/${id}`)
        setTasks(tasksRes.data)
      } catch (err) {
        setError("Error refreshing tasks: " + (err.response?.data?.message || err.message))
      }
    }

    fetchTasks()
  }

  if (loading) {
    return (
        <div className="loading-container">
          <Loader type="dots" text="Loading project..." />
        </div>
    )
  }

  if (!project) {
    return <div className="not-found">Project not found</div>
  }

  const isOwner = user && project.owner && user.id === project.owner._id

  return (
      <div className="project-details-page">
        <div className="container">
          <div className="project-header">
            <div className="project-info">
              <h1 className="project-title">{project.title}</h1>
              <p className="project-description">{project.description || "No description"}</p>
            </div>
            <div className="actions">
              <button onClick={() => navigate("/")} className="back-button">
                <span className="button-icon">←</span>
                Back to Projects
              </button>
              {isOwner && (
                  <button onClick={() => setShowInviteForm(!showInviteForm)} className="invite-button">
                    <span className="button-icon">+</span>
                    Invite User
                  </button>
              )}
            </div>
          </div>

          {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
          )}

          {/* Add a new tab for badges */}
          <div className="tabs">
            <button onClick={() => setActiveTab("tasks")} className={activeTab === "tasks" ? "active-tab" : "tab"}>
              <span className="tab-icon">📋</span>
              Tasks
            </button>
            <button
                onClick={() => setActiveTab("automations")}
                className={activeTab === "automations" ? "active-tab" : "tab"}
            >
              <span className="tab-icon">⚙️</span>
              Automations
            </button>
            <button onClick={() => setActiveTab("members")} className={activeTab === "members" ? "active-tab" : "tab"}>
              <span className="tab-icon">👥</span>
              Members
            </button>
            <button onClick={() => setActiveTab("badges")} className={activeTab === "badges" ? "active-tab" : "tab"}>
              <span className="tab-icon">🏆</span>
              Badges
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "tasks" && (
                <div className="tab-panel">
                  <div className="section-header">
                    <h2 className="section-title">Tasks</h2>
                    <button
                        onClick={() => setShowTaskForm(!showTaskForm)}
                        className={showTaskForm ? "cancel-button" : "add-button"}
                    >
                      {showTaskForm ? "Cancel" : "Add Task"}
                    </button>
                  </div>

                  {showTaskForm && (
                      <div className="form-container">
                        <TaskForm onSubmit={handleTaskCreate} onCancel={() => setShowTaskForm(false)} project={project} />
                      </div>
                  )}

                  {showBadgeForm && selectedTaskId && (
                      <div className="form-container">
                        <TaskBadgeForm
                            taskId={selectedTaskId}
                            onSuccess={handleBadgeSuccess}
                            onCancel={() => setShowBadgeForm(false)}
                        />
                      </div>
                  )}

                  <TaskList
                      tasks={tasks}
                      statuses={project.statuses}
                      onStatusChange={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                      onAddBadge={handleAddBadge}
                      members={project.members}
                  />
                </div>
            )}

            {activeTab === "automations" && (
                <div className="tab-panel">
                  <div className="section-header">
                    <h2 className="section-title">Automations</h2>
                    {isOwner && (
                        <button
                            onClick={() => setShowAutomationForm(!showAutomationForm)}
                            className={showAutomationForm ? "cancel-button" : "add-button"}
                        >
                          {showAutomationForm ? "Cancel" : "Add Automation"}
                        </button>
                    )}
                  </div>

                  {showAutomationForm && (
                      <div className="form-container">
                        <AutomationForm
                            onSubmit={handleAutomationCreate}
                            onCancel={() => setShowAutomationForm(false)}
                            project={project}
                        />
                      </div>
                  )}

                  <AutomationList automations={automations} onDelete={handleAutomationDelete} isOwner={isOwner} />
                </div>
            )}

            {activeTab === "members" && (
                <div className="tab-panel">
                  <h2 className="section-title">Project Members</h2>
                  <div className="members-list">
                    {project.members &&
                        project.members.map((member, index) => (
                            <div
                                key={member._id || `member-${index}`}
                                className="member-card"
                                style={{
                                  animationDelay: `${index * 0.1}s`,
                                }}
                            >
                              <div className="member-avatar">{member.name?.charAt(0) || "?"}</div>
                              <div className="member-info">
                                <div className="member-name">{member.name || "Loading..."}</div>
                                <div className="member-email">{member.email || "Loading..."}</div>

                                {member.badges && member.badges.length > 0 && (
                                    <div className="member-badges">
                                      <BadgesList badges={getMemberBadges(member)} />
                                    </div>
                                )}
                              </div>
                              {project.owner && member._id === project.owner._id && <div className="owner-badge">Owner</div>}
                            </div>
                        ))}
                  </div>
                </div>
            )}

            {/* Add the badges tab content */}
            {activeTab === "badges" && (
                <div className="tab-panel">
                  <h2 className="section-title">Project Badges</h2>
                  <BadgeManager projectId={id} />
                </div>
            )}
          </div>

          {showInviteForm && <InviteForm onSubmit={handleInviteUser} onCancel={() => setShowInviteForm(false)} />}
        </div>
      </div>
  )
}

export default ProjectDetails
