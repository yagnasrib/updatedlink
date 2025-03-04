"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../Firebase/Firebase"
import "./HomePage.css"

function HomePage({ user }) {
  const [roomId, setRoomId] = useState("")
  const [joinRoomId, setJoinRoomId] = useState("")
  const [activeTab, setActiveTab] = useState("create") // "create" or "join"
  const navigate = useNavigate()

  const handleRoomIdGenerate = () => {
    const randomId = Math.random().toString(36).substring(2, 9)
    const timestamp = Date.now().toString().slice(-4)
    setRoomId(randomId + timestamp)
  }

  const createRoomInDatabase = async (type) => {
    if (!user) {
      console.warn("User not logged in, room will not be saved to database")
      return
    }

    try {
      await axios.post(`${API_URL}/rooms`, {
        roomId: roomId,
        hostId: user.uid,
        type: type,
      })
      console.log(`Room created in database: ${roomId}`)
    } catch (error) {
      console.error("Error creating room in database:", error)
      // Continue with navigation even if database save fails
    }
  }

  const handleOneAndOneCall = async () => {
    if (!roomId) {
      alert("Please Generate Room Id First")
      return
    }

    await createRoomInDatabase("one-on-one")
    navigate(`/room/${roomId}?type=one-on-one`)
  }

  const handleGroupCall = async () => {
    if (!roomId) {
      alert("Please Generate Room Id First")
      return
    }

    await createRoomInDatabase("group-call")
    navigate(`/room/${roomId}?type=group-call`)
  }

  const handleJoinRoom = async (type) => {
    if (!joinRoomId.trim()) {
      alert("Please enter a valid Room ID")
      return
    }

    try {
      // Check if room exists in database
      const response = await axios.get(`${API_URL}/rooms/${joinRoomId}`)
      console.log("Room found:", response.data)

      // Use the room type from the database if available
      const roomType = response.data.type || type
      navigate(`/room/${joinRoomId}?type=${roomType}`)
    } catch (error) {
      console.log("Room not found in database, joining anyway")
      navigate(`/room/${joinRoomId}?type=${type}`)
    }
  }

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="homepage-title">Welcome to Video Calling App</h1>

        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Create Room
          </button>
          <button className={`tab-button ${activeTab === "join" ? "active" : ""}`} onClick={() => setActiveTab("join")}>
            Join Room
          </button>
        </div>

        {activeTab === "create" ? (
          <div className="tab-content">
            <p className="homepage-subtitle">Start a video call with a randomly generated Room ID</p>
            <div className="room-id-container">
              <input type="text" className="room-id-input" placeholder="Generated Room ID" value={roomId} readOnly />
              <button className="generate-button" onClick={handleRoomIdGenerate}>
                Generate
              </button>
            </div>
            <div className="call-buttons">
              <button className="call-button" onClick={handleOneAndOneCall} disabled={!roomId}>
                One-on-One Call
              </button>
              <button className="call-button" onClick={handleGroupCall} disabled={!roomId}>
                Group Call
              </button>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            <p className="homepage-subtitle">Enter an existing Room ID to join a call</p>
            <div className="room-id-container">
              <input
                type="text"
                className="room-id-input"
                placeholder="Enter Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
              />
            </div>
            <div className="call-buttons">
              <button className="call-button" onClick={() => handleJoinRoom("one-on-one")} disabled={!joinRoomId}>
                Join One-on-One Call
              </button>
              <button className="call-button" onClick={() => handleJoinRoom("group-call")} disabled={!joinRoomId}>
                Join Group Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage

