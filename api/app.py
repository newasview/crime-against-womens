from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import mysql.connector
from mysql.connector import Error

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# MySQL connection settings
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',  # MySQL host
            database='crime_dashboard',  # Database name
            user='root',  # Your MySQL username
            password='Kpow3363#'  # Your MySQL password
        )
        return connection
    except Error as e:
        print(f"Error: {e}")
        return None

# Pydantic model for crime data
class CrimeData(BaseModel):
    state: str
    year: int
    rape: int
    ka: int
    dd: int
    aow: int
    aom: int
    dv: int
    wt: int

@app.get("/crimes", response_model=List[CrimeData])
async def get_crimes():
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT *, LOWER(state) as lowerstate FROM crimeswomen")
        rows = cursor.fetchall()
        return rows
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")
    finally:
        connection.close()

@app.get("/crimes/{state}", response_model=List[CrimeData])
async def get_crimes_by_state(state: str):
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT *, LOWER(state) as lowerstate FROM crimeswomen WHERE state = %s", (state,))
        rows = cursor.fetchall()
        return rows
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")
    finally:
        connection.close()

@app.get("/crimeorderby/{order}/{direction}", response_model=List[CrimeData])
async def get_crimes_by_state(order: str, direction: str):
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT *, LOWER(state) as lowerstate FROM crimeswomen ORDER BY %s %s", (order, direction))
        rows = cursor.fetchall()
        return rows
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")
    finally:
        connection.close()

# Pydantic model for aggregated crime data by state
class AggregatedCrimeData(BaseModel):
    state: str
    crime_rate: float  # We can calculate a simple crime rate, or more advanced metrics

@app.get("/crimesaggregated", response_model=List[AggregatedCrimeData])
async def get_aggregated_crime_data():
    connection = get_db_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = connection.cursor(dictionary=True)
        # Aggregating crime data by state (You can adjust the columns based on your requirements)
        cursor.execute("""
            SELECT state, 
                   SUM(rape + ka + dd + aow + aom + dv + wt) AS total_crimes,
                   COUNT(*) AS num_records
            FROM crimeswomen
            GROUP BY state
        """)
        rows = cursor.fetchall()

        # Calculating crime rate: sum of crimes divided by the number of records for each state
        aggregated_data = []
        for row in rows:
            crime_rate = row["total_crimes"] / row["num_records"]  # Simplified crime rate
            aggregated_data.append(AggregatedCrimeData(state=row["state"], crime_rate=crime_rate))

        # Sort by crime_rate in descending order
        aggregated_data.sort(key=lambda x: x.crime_rate, reverse=True)

        return aggregated_data

    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")
    finally:
        connection.close()