"use client"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth, signInWithGoogle, logout } from "./components/Firebase/Firebase"
import HomePage from "./components/HomePage/HomePage"
import Room from "./components/Room/Room"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Login error:", error)
      alert("Failed to login. Please try again.")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <nav className="app-nav">
        {user ? (
          <div className="user-info">
            <span>{user.displayName}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Sign in with Google</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/room/:roomId" element={<Room user={user} />} />
      </Routes>
    </div>
  )
}

export default App

