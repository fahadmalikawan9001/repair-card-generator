"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"

interface VehiclePart {
  id: string
  name: string
  part_type: string
  car_model: string
  stock: number
  min_stock_level: number
}

interface PartListProps {
  parts: VehiclePart[]
  onStockUpdate: () => void
}

const PartList: React.FC<PartListProps> = ({ parts, onStockUpdate }) => {
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({})
  const [message, setMessage] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStockChange = (partId: string, value: string) => {
    setEditingStock({
      ...editingStock,
      [partId]: Number.parseInt(value, 10) || 0,
    })
  }

  const handleUpdateStock = async (partId: string) => {
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

  return (
    <div className="part-list-container">
      <h2>Current Inventory</h2>
      {parts.length === 0 ? (
        <p>No parts in inventory. Add some parts!</p>
      ) : (
        <table className="part-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Car Model</th>
              <th>Stock</th>
              <th>Min Stock Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id}>
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
                    disabled={isUpdating || editingStock[part.id] === undefined || editingStock[part.id] === part.stock}
                    className="update-stock-button"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <div className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</div>}
    </div>
  )
}

export default PartList
