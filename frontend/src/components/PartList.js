"use client"

import { useState } from "react"
import axios from "axios"

const PartList = ({ parts, onStockUpdate }) => {
  const [editingStock, setEditingStock] = useState({})
  const [message, setMessage] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("") // New state for search query

  const handleStockChange = (partId, value) => {
    setEditingStock({
      ...editingStock,
      [partId]: Number.parseInt(value, 10) || 0,
    })
  }

  const handleUpdateStock = async (partId) => {
    const newStock = editingStock[partId]
    if (newStock === undefined || isNaN(newStock)) {
      setMessage("Please enter a valid number for stock.")
      return
    }

    setIsUpdating(true)
    setMessage("")
    try {
      await axios.put(`http://localhost:8000/api/parts/${partId}?new_stock=${newStock}`)
      setMessage("Stock updated successfully!")
      setEditingStock((prev) => {
        const newState = { ...prev }
        delete newState[partId]
        return newState
      })
      onStockUpdate() // Trigger re-fetch in parent
    } catch (error) {
      console.error("Error updating stock:", error)
      setMessage("Error updating stock. Please try again.")
    } finally {
      setIsUpdating(false)
      setTimeout(() => setMessage(""), 3000) // Clear message after 3 seconds
    }
  }

  // Filter parts based on search query
  const filteredParts = parts.filter((part) => part.id.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="part-list-container">
      <h2>Current Inventory</h2>
      <div className="search-bar">
        {" "}
        {/* New search bar container */}
        <label htmlFor="part-id-search">Search by Part ID:</label>
        <input
          type="text"
          id="part-id-search"
          placeholder="Enter Part ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      {filteredParts.length === 0 && searchQuery !== "" ? ( // Display message if no results for search
        <p>No parts found matching the ID "{searchQuery}".</p>
      ) : filteredParts.length === 0 ? ( // Display message if no parts at all
        <p>No parts in inventory. Add some parts!</p>
      ) : (
        <table className="part-table">
          <thead>
            <tr>
              <th>ID</th> {/* New column for ID */}
              <th>Name</th>
              <th>Type</th>
              <th>Car Model</th>
              <th>Stock</th>
              <th>Min Stock Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map(
              (
                part, // Use filteredParts here
              ) => (
                <tr key={part.id}>
                  <td>{part.id}</td> {/* Display part ID */}
                  <td>{part.name}</td>
                  <td>{part.part_type}</td>
                  <td>{part.car_model}</td>
                  <td>
                    <input
                      type="number"
                      value={editingStock[part.id] !== undefined ? editingStock[part.id] : part.stock}
                      onChange={(e) => handleStockChange(part.id, e.target.value)}
                      className="stock-input"
                      min="0"
                    />
                  </td>
                  <td>{part.min_stock_level}</td>
                  <td>
                    <button
                      onClick={() => handleUpdateStock(part.id)}
                      disabled={
                        isUpdating || editingStock[part.id] === undefined || editingStock[part.id] === part.stock
                      }
                      className="update-stock-button"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
      {message && <div className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</div>}
    </div>
  )
}

export default PartList
