"use client"

import { useState } from "react"
import axios from "axios"

const AddPartForm = ({ onPartAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    part_type: "",
    car_model: "",
    stock: 0,
    min_stock_level: 20,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "stock" || name === "min_stock_level" ? Number.parseInt(value, 10) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    if (formData.stock < 0 || formData.min_stock_level < 0) {
      setMessage("Stock and minimum stock level cannot be negative.")
      setIsSubmitting(false)
      return
    }

    try {
      await axios.post("http://localhost:8000/api/parts", formData)
      setMessage("Part added successfully!")
      setFormData({
        name: "",
        part_type: "",
        car_model: "",
        stock: 0,
        min_stock_level: 20,
      })
      onPartAdded() // Notify parent to re-fetch data
    } catch (error) {
      console.error("Error adding part:", error)
      setMessage("Error adding part. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setMessage(""), 3000) // Clear message after 3 seconds
    }
  }

  return (
    <div className="form-container">
      <h2>Add New Vehicle Part</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Part Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Oil Filter"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="part_type">Part Type</label>
          <input
            type="text"
            id="part_type"
            name="part_type"
            value={formData.part_type}
            onChange={handleChange}
            placeholder="e.g., Engine, AC, Brake"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="car_model">Compatible Car Model</label>
          <input
            type="text"
            id="car_model"
            name="car_model"
            value={formData.car_model}
            onChange={handleChange}
            placeholder="e.g., Toyota Camry 2020, All Models"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Current Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="min_stock_level">Minimum Stock Level (for alerts)</label>
          <input
            type="number"
            id="min_stock_level"
            name="min_stock_level"
            value={formData.min_stock_level}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Part"}
        </button>
        {message && <div className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</div>}
      </form>
    </div>
  )
}

export default AddPartForm
