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

  if (loading) {
    return (
        <div style={styles.loadingContainer}>
          <Loader type="dots" text="Loading project..." />
        </div>
    )
  }

  if (!project) {
    return <div style={styles.notFound}>Project not found</div>
  }

  const isOwner = user && project.owner && user.id === project.owner._id

  return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.projectHeader}>
            <div style={styles.projectInfo}>
              <h1 style={styles.projectTitle}>{project.title}</h1>
              <p style={styles.projectDescription}>{project.description || "No description"}</p>
            </div>
            <div style={styles.actions}>
              <button onClick={() => navigate("/")} style={styles.backButton}>
                <span style={styles.buttonIcon}>←</span>
                Back to Projects
              </button>
              {isOwner && (
                  <button onClick={() => setShowInviteForm(!showInviteForm)} style={styles.inviteButton}>
                    <span style={styles.buttonIcon}>+</span>
                    Invite User
                  </button>
              )}
            </div>
          </div>

          {error && (
              <div style={styles.error}>
                <span style={styles.errorIcon}>⚠️</span>
                {error}
              </div>
          )}

          <div style={styles.tabs}>
            <button onClick={() => setActiveTab("tasks")} style={activeTab === "tasks" ? styles.activeTab : styles.tab}>
              <span style={styles.tabIcon}>📋</span>
              Tasks
            </button>
            <button
                onClick={() => setActiveTab("automations")}
                style={activeTab === "automations" ? styles.activeTab : styles.tab}
            >
              <span style={styles.tabIcon}>⚙️</span>
              Automations
            </button>
            <button
                onClick={() => setActiveTab("members")}
                style={activeTab === "members" ? styles.activeTab : styles.tab}
            >
              <span style={styles.tabIcon}>👥</span>
              Members
            </button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === "tasks" && (
                <div style={styles.tabPanel}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Tasks</h2>
                    <button
                        onClick={() => setShowTaskForm(!showTaskForm)}
                        style={showTaskForm ? styles.cancelButton : styles.addButton}
                    >
                      {showTaskForm ? "Cancel" : "Add Task"}
                    </button>
                  </div>

                  {showTaskForm && (
                      <div style={styles.formContainer}>
                        <TaskForm onSubmit={handleTaskCreate} onCancel={() => setShowTaskForm(false)} project={project} />
                      </div>
                  )}

                  <TaskList
                      tasks={tasks}
                      statuses={project.statuses}
                      onStatusChange={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                      members={project.members}
                  />
                </div>
            )}

            {activeTab === "automations" && (
                <div style={styles.tabPanel}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Automations</h2>
                    {isOwner && (
                        <button
                            onClick={() => setShowAutomationForm(!showAutomationForm)}
                            style={showAutomationForm ? styles.cancelButton : styles.addButton}
                        >
                          {showAutomationForm ? "Cancel" : "Add Automation"}
                        </button>
                    )}
                  </div>

                  {showAutomationForm && (
                      <div style={styles.formContainer}>
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
                <div style={styles.tabPanel}>
                  <h2 style={styles.sectionTitle}>Project Members</h2>
                  <div style={styles.membersList}>
                    {project.members &&
                        project.members.map((member, index) => (
                            <div
                                key={member._id || `member-${index}`}
                                style={{
                                  ...styles.memberCard,
                                  animationDelay: `${index * 0.1}s`,
                                }}
                            >
                              <div style={styles.memberAvatar}>{member.name?.charAt(0) || "?"}</div>
                              <div style={styles.memberInfo}>
                                <div style={styles.memberName}>{member.name || "Loading..."}</div>
                                <div style={styles.memberEmail}>{member.email || "Loading..."}</div>

                                {member.badges && member.badges.length > 0 && (
                                    <div style={styles.memberBadges}>
                                      <BadgesList badges={getMemberBadges(member)} />
                                    </div>
                                )}
                              </div>
                              {project.owner && member._id === project.owner._id && <div style={styles.ownerBadge}>Owner</div>}
                            </div>
                        ))}
                  </div>
                </div>
            )}
          </div>

          {showInviteForm && <InviteForm onSubmit={handleInviteUser} onCancel={() => setShowInviteForm(false)} />}
        </div>
      </div>
  )
}

const styles = {
  pageContainer: {
    minHeight: "calc(100vh - 70px)",
    background: "linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)",
    padding: "40px 0",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    animation: "fadeIn 0.5s ease-in-out",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 70px)",
  },
  notFound: {
    textAlign: "center",
    padding: "50px",
    fontSize: "20px",
    color: "#ef4444",
    animation: "fadeIn 0.5s ease-in-out",
  },
  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
      alignItems: "stretch",
    },
  },
  projectInfo: {
    flex: "1",
  },
  projectTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 10px 0",
    background: "linear-gradient(135deg, #1e293b 0%, #3a6df0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  projectDescription: {
    fontSize: "16px",
    color: "#64748b",
    margin: "0",
    lineHeight: "1.6",
  },
  actions: {
    display: "flex",
    gap: "12px",
    "@media (max-width: 640px)": {
      flexDirection: "column",
      width: "100%",
    },
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f1f5f9",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    "@media (max-width: 640px)": {
      width: "100%",
      justifyContent: "center",
    },
  },
  inviteButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#3a6df0",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(58, 109, 240, 0.25)",
    "&:hover": {
      backgroundColor: "#5a89ff",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 10px rgba(58, 109, 240, 0.3)",
    },
    "@media (max-width: 640px)": {
      width: "100%",
      justifyContent: "center",
    },
  },
  buttonIcon: {
    fontSize: "16px",
  },
  error: {
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontWeight: "500",
    animation: "shake 0.5s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  errorIcon: {
    fontSize: "18px",
  },
  tabs: {
    display: "flex",
    borderBottom: "2px solid #e2e8f0",
    marginBottom: "25px",
    gap: "5px",
    overflowX: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "@media (max-width: 640px)": {
      gap: "0",
    },
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    color: "#64748b",
    transition: "all 0.3s ease",
    marginBottom: "-2px",
    whiteSpace: "nowrap",
    "&:hover": {
      color: "#3a6df0",
    },
    "@media (max-width: 640px)": {
      padding: "12px 15px",
      fontSize: "14px",
    },
  },
  activeTab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid #3a6df0",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    color: "#3a6df0",
    transition: "all 0.3s ease",
    marginBottom: "-2px",
    whiteSpace: "nowrap",
    "@media (max-width: 640px)": {
      padding: "12px 15px",
      fontSize: "14px",
    },
  },
  tabIcon: {
    fontSize: "18px",
    "@media (max-width: 480px)": {
      fontSize: "16px",
    },
  },
  tabContent: {
    padding: "10px 0",
  },
  tabPanel: {
    animation: "fadeIn 0.5s ease-in-out",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    "@media (max-width: 640px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "15px",
    },
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    backgroundColor: "#3a6df0",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(58, 109, 240, 0.25)",
    "&:hover": {
      backgroundColor: "#5a89ff",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 10px rgba(58, 109, 240, 0.3)",
    },
    "&::before": {
      content: '"+"',
      marginRight: "5px",
      fontSize: "16px",
      fontWeight: "bold",
    },
    "@media (max-width: 640px)": {
      width: "100%",
      justifyContent: "center",
    },
  },
  cancelButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e2e8f0",
    },
    "&::before": {
      content: '"×"',
      marginRight: "5px",
      fontSize: "16px",
      fontWeight: "bold",
    },
    "@media (max-width: 640px)": {
      width: "100%",
      justifyContent: "center",
    },
  },
  formContainer: {
    marginBottom: "25px",
    animation: "slideInUp 0.5s ease-in-out",
  },
  membersList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
    "@media (max-width: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },
  memberCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    transition: "all 0.3s ease",
    animation: "fadeIn 0.5s ease-in-out both",
    border: "1px solid #e2e8f0",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      borderColor: "#3a6df0",
    },
  },
  memberAvatar: {
    width: "50px",
    height: "50px",
    backgroundColor: "#3a6df0",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "600",
    boxShadow: "0 4px 10px rgba(58, 109, 240, 0.3)",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontWeight: "600",
    fontSize: "17px",
    color: "#1e293b",
    marginBottom: "5px",
  },
  memberEmail: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "10px",
  },
  memberBadges: {
    marginTop: "10px",
  },
  ownerBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#3a6df0",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: "0 2px 5px rgba(58, 109, 240, 0.25)",
  },
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  "@keyframes slideInUp": {
    from: {
      transform: "translateY(20px)",
      opacity: 0,
    },
    to: {
      transform: "translateY(0)",
      opacity: 1,
    },
  },
  "@keyframes shake": {
    "0%, 100%": {
      transform: "translateX(0)",
    },
    "10%, 30%, 50%, 70%, 90%": {
      transform: "translateX(-5px)",
    },
    "20%, 40%, 60%, 80%": {
      transform: "translateX(5px)",
    },
  },
}

export default ProjectDetails
