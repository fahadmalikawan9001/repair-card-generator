import type React from "react"

interface VehiclePart {
  id: string
  name: string
  part_type: string
  car_model: string
  stock: number
  min_stock_level: number
}

interface RestockAlertsProps {
  alerts: VehiclePart[]
}

const RestockAlerts: React.FC<RestockAlertsProps> = ({ alerts }) => {
  return (
    <div className="alerts-container">
      <h2>Restock Alerts</h2>
      {alerts.length === 0 ? (
        <p>No parts currently need restocking. Good job!</p>
      ) : (
        <ul className="alert-list">
          {alerts.map((part) => (
            <li key={part.id} className="alert-item">
              <strong>{part.name}</strong>
              <span>
                Type: {part.part_type} | Model: {part.car_model}
              </span>
              <span className="stock-level">
                Current Stock: {part.stock} (Below minimum of {part.min_stock_level})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default RestockAlerts
