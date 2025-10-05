"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import PartList from "./components/PartList.js" // Explicitly use .js extension
import RestockAlerts from "./components/RestockAlerts.js" // Explicitly use .js extension
import AddPartForm from "./components/AddPartForm.js" // Explicitly use .js extension
import "./App.css"

function App() {
  const [parts, setParts] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("inventory")

  const fetchParts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/parts")
      setParts(response.data)
    } catch (error) {
      console.error("Error fetching parts:", error)
    }
  }

  const fetchAlerts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/alerts")
      setAlerts(response.data)
    } catch (error) {
      console.error("Error fetching alerts:", error)
    }
  }

  useEffect(() => {
    fetchParts()
    fetchAlerts()
    setLoading(false)
    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      fetchParts()
      fetchAlerts()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const handlePartAdded = () => {
    fetchParts()
    fetchAlerts()
    setActiveTab("inventory") // Switch to inventory tab after adding
  }

  const handleStockUpdate = () => {
    fetchParts()
    setTimeout(() => {
      fetchAlerts()
    }, 500) // Add a 500ms delay to ensure backend processes the update
  }

  if (loading) {
    return <div className="loading">Loading inventory...</div>
  }

  return (
    <div className="App">
      <header className="header">
        <h1>Vehicle Parts Inventory</h1>
      </header>
      <nav className="tabs">
        <button className={activeTab === "inventory" ? "active" : ""} onClick={() => setActiveTab("inventory")}>
          Inventory
        </button>
        <button className={activeTab === "alerts" ? "active" : ""} onClick={() => setActiveTab("alerts")}>
          Alerts ({alerts.length})
        </button>
        <button className={activeTab === "add" ? "active" : ""} onClick={() => setActiveTab("add")}>
          Add New Part
        </button>
      </nav>
      <main className="main-content">
        {activeTab === "inventory" && <PartList parts={parts} onStockUpdate={handleStockUpdate} />}
        {activeTab === "alerts" && <RestockAlerts alerts={alerts} />}
        {activeTab === "add" && <AddPartForm onPartAdded={handlePartAdded} />}
      </main>
    </div>
  )
}

export default App
