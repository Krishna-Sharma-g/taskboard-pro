"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

// Components
import Navbar from "./components/Navbar"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/Dashboard"
import ProjectDetails from "./components/projects/ProjectDetails"
import CreateProject from "./components/projects/CreateProject"

function App() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        )
    }

    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                    <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/projects/new" element={isAuthenticated ? <CreateProject /> : <Navigate to="/login" />} />
                    <Route path="/projects/:id" element={isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
