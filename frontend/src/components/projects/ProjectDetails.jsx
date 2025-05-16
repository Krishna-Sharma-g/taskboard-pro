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
    return <div style={styles.loading}>Loading project...</div>
  }

  if (!project) {
    return <div style={styles.notFound}>Project not found</div>
  }

  const isOwner = user && project.owner && user.id === project.owner._id

  return (
      <div style={styles.container}>
        <div style={styles.projectHeader}>
          <div style={styles.projectInfo}>
            <h1 style={styles.projectTitle}>{project.title}</h1>
            <p style={styles.projectDescription}>{project.description || "No description"}</p>
          </div>
          <div style={styles.actions}>
            <button onClick={() => navigate("/")} style={styles.backButton}>
              Back to Projects
            </button>
            {isOwner && (
                <button onClick={() => setShowInviteForm(!showInviteForm)} style={styles.inviteButton}>
                  Invite User
                </button>
            )}
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.tabs}>
          <button onClick={() => setActiveTab("tasks")} style={activeTab === "tasks" ? styles.activeTab : styles.tab}>
            Tasks
          </button>
          <button
              onClick={() => setActiveTab("automations")}
              style={activeTab === "automations" ? styles.activeTab : styles.tab}
          >
            Automations
          </button>
          <button onClick={() => setActiveTab("members")} style={activeTab === "members" ? styles.activeTab : styles.tab}>
            Members
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === "tasks" && (
              <div>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Tasks</h2>
                  <button onClick={() => setShowTaskForm(!showTaskForm)} style={styles.addButton}>
                    {showTaskForm ? "Cancel" : "Add Task"}
                  </button>
                </div>

                {showTaskForm && (
                    <TaskForm onSubmit={handleTaskCreate} onCancel={() => setShowTaskForm(false)} project={project} />
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
              <div>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Automations</h2>
                  {isOwner && (
                      <button onClick={() => setShowAutomationForm(!showAutomationForm)} style={styles.addButton}>
                        {showAutomationForm ? "Cancel" : "Add Automation"}
                      </button>
                  )}
                </div>

                {showAutomationForm && (
                    <AutomationForm
                        onSubmit={handleAutomationCreate}
                        onCancel={() => setShowAutomationForm(false)}
                        project={project}
                    />
                )}

                <AutomationList automations={automations} onDelete={handleAutomationDelete} isOwner={isOwner} />
              </div>
          )}

          {activeTab === "members" && (
              <div>
                <h2 style={styles.sectionTitle}>Project Members</h2>
                <div style={styles.membersList}>
                  {project.members &&
                      project.members.map((member) => (
                          <div key={member._id || member} style={styles.memberCard}>
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
  )
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#7f8c8d",
  },
  notFound: {
    textAlign: "center",
    padding: "50px",
    fontSize: "20px",
    color: "#e74c3c",
  },
  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "20px",
  },
  projectInfo: {
    flex: "1",
  },
  projectTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#2c3e50",
    margin: "0 0 10px 0",
  },
  projectDescription: {
    fontSize: "16px",
    color: "#7f8c8d",
    margin: "0",
    lineHeight: "1.6",
  },
  actions: {
    display: "flex",
    gap: "12px",
  },
  backButton: {
    padding: "10px 16px",
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  inviteButton: {
    padding: "10px 16px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(52, 152, 219, 0.25)",
  },
  error: {
    color: "#e74c3c",
    backgroundColor: "#fadbd8",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "500",
  },
  tabs: {
    display: "flex",
    borderBottom: "2px solid #f0f0f0",
    marginBottom: "25px",
    gap: "5px",
  },
  tab: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    color: "#7f8c8d",
    transition: "all 0.3s ease",
    marginBottom: "-2px",
  },
  activeTab: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid #3498db",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    transition: "all 0.3s ease",
    marginBottom: "-2px",
  },
  tabContent: {
    padding: "10px 0",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0",
  },
  addButton: {
    padding: "10px 18px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(52, 152, 219, 0.25)",
  },
  membersList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  memberCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  memberAvatar: {
    width: "50px",
    height: "50px",
    backgroundColor: "#3498db",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "600",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontWeight: "600",
    fontSize: "17px",
    color: "#2c3e50",
    marginBottom: "5px",
  },
  memberEmail: {
    color: "#7f8c8d",
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
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: "0 2px 5px rgba(52, 152, 219, 0.25)",
  },
}

export default ProjectDetails
