"use client"

import { useRef, useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"
import "./Room.css"
import { APP_ID, SECRET } from "../../Config"

function Room({ user }) {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const videoContainerRef = useRef(null)
  const [joined, setJoined] = useState(false)
  const [callType, setCallType] = useState("")
  const [zegoInstance, setZegoInstance] = useState(null)

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const type = query.get("type")
    if (type) {
      setCallType(type)
    }
  }, [location.search])

  useEffect(() => {
    let isMounted = true

    const initializeZegoCloud = async () => {
      if (!callType || !roomId || !videoContainerRef.current) return

      try {
        // 🔹 Destroy previous instance before creating a new one
        if (zegoInstance) {
          await new Promise((resolve) => {
            zegoInstance.destroy()
            setTimeout(resolve, 1000) // Ensure it has time to clean up
          })
          setZegoInstance(null) // Reset instance to prevent conflicts
        }

        const appID = APP_ID
        const serverSecret = SECRET
        const userName = user?.displayName || "Guest User"

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          Date.now().toString(),
          userName
        )

        const zp = ZegoUIKitPrebuilt.create(kitToken)

        if (isMounted) {
          setZegoInstance(zp)

          zp.joinRoom({
            container: videoContainerRef.current,
            sharedLinks: [
              {
                name: "Video Call Link",
                url: `${window.location.protocol}//${window.location.host}/room/${roomId}?type=${encodeURIComponent(callType)}`,
              },
            ],
            scenario: {
              mode: callType === "one-on-one" ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall,
            },
            maxUsers: callType === "one-on-one" ? 2 : 10,
            onJoinRoom: () => {
              if (isMounted) setJoined(true)
            },
            onLeaveRoom: () => {
              if (isMounted) navigate("/")
            },
          })
        }
      } catch (error) {
        console.error("Error initializing ZegoCloud:", error)
      }
    }

    initializeZegoCloud()

    return () => {
      isMounted = false
      if (zegoInstance) {
        setTimeout(() => {
          try {
            zegoInstance.destroy()
            setZegoInstance(null)
          } catch (error) {
            console.error("Error during cleanup:", error)
          }
        }, 500)
      }
    }
  }, [callType, roomId, navigate, user])

  const handleExit = () => {
    if (zegoInstance) {
      try {
        zegoInstance.destroy()
        setZegoInstance(null)
      } catch (error) {
        console.error("Error destroying instance:", error)
      }
    }
    navigate("/")
  }

  return (
    <div className="room-container">
      {!joined && (
        <>
          <header className="room-header">
            {callType === "one-on-one" ? "One-on-One Video Call" : "Group Video Call"}
          </header>
          <button className="exit-button" onClick={handleExit}>
            Exit
          </button>
        </>
      )}
      <div ref={videoContainerRef} className="video-container" />
    </div>
  )
}

export default Room
