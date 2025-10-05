from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI(title="Vehicle Parts Inventory System")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://your-vercel-app-name.vercel.app"
],
, # Allow your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Model for a Vehicle Part
class VehiclePart(BaseModel):
    id: Optional[str] = None
    name: str # e.g., "Oil Filter"
    part_type: str # e.g., "Engine", "AC", "Brake"
    car_model: str # e.g., "Toyota Camry 2020", "Honda Civic 2018"
    stock: int
    min_stock_level: int = 20 # Default alert threshold

# In-memory storage for dummy data
# You can modify this list to change the initial dummy data.
# This is where your dummy data is stored.
parts_db: List[VehiclePart] = [
    VehiclePart(id="O1", name="Oil Filter", part_type="Engine", car_model="Toyota Camry 2020", stock=50, min_stock_level=20),
    VehiclePart(id="A2", name="AC Filter", part_type="AC", car_model="Honda Civic 2018", stock=15, min_stock_level=20),
    VehiclePart(id="B3", name="Brake Pad Set", part_type="Brake", car_model="Ford F-150 2022", stock=25, min_stock_level=20),
    VehiclePart(id="S4", name="Spark Plug (4-pack)", part_type="Engine", car_model="Nissan Altima 2019", stock=10, min_stock_level=20),
    VehiclePart(id="W5", name="Wiper Blades (Front)", part_type="Exterior", car_model="All Models", stock=30, min_stock_level=20),
    VehiclePart(id="A6", name="Air Filter", part_type="Engine", car_model="Volkswagen Golf 2017", stock=22, min_stock_level=20),
    VehiclePart(id="C7", name="Cabin Filter", part_type="AC", car_model="Mercedes-Benz C-Class 2021", stock=18, min_stock_level=20),
]


@app.get("/")
def read_root():
    return {"message": "Vehicle Parts Inventory System API"}

# Vehicle Parts Inventory endpoints
@app.get("/api/parts", response_model=List[VehiclePart])
def get_all_parts():
    return parts_db

@app.post("/api/parts", response_model=VehiclePart)
def add_part(part: VehiclePart):
    part.id = str(uuid.uuid4())
    parts_db.append(part)
    return part

@app.put("/api/parts/{part_id}", response_model=VehiclePart)
def update_part_stock(part_id: str, new_stock: int):
    for part in parts_db:
        if part.id == part_id:
            part.stock = new_stock
            return part
    raise HTTPException(status_code=404, detail="Part not found")

@app.get("/api/alerts", response_model=List[VehiclePart])
def get_restock_alerts():
    return [part for part in parts_db if part.stock <= part.min_stock_level]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
