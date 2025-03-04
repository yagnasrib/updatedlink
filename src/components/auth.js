import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDwFEYC-XWGFX5KZabcIoTUjIbyFhg9Mc8",
  authDomain: "signup-c1513.firebaseapp.com",
  projectId: "signup-c1513",
  storageBucket: "signup-c1513.appspot.com",
  messagingSenderId: "595125195153",
  appId: "1:595125195153:web:b7c357d9c58744598e0a30",
  measurementId: "G-WB97HR045H",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

// Sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error("Google Sign-In Error:", error)
    throw error // Re-throw to allow handling in the component
  }
}

// Sign out
const logout = async () => {
  try {
    await signOut(auth)
    console.log("User signed out successfully")
  } catch (error) {
    console.error("Sign-Out Error:", error)
    throw error
  }
}

export { auth, signInWithGoogle, logout }

