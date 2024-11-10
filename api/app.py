from fastapi import FastAPI
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

@app.get("/crimes/", response_model=List[CrimeData])
async def get_crimes():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT *, LOWER(state) as lowerstate FROM crimeswomen")
    rows = cursor.fetchall()
    connection.close()
    return rows

@app.get("/crimes/{state}", response_model=List[CrimeData])
async def get_crimes_by_state(state: str):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT *, LOWER(state) as lowerstate FROM crimeswomen WHERE state = %s", (state,))
    rows = cursor.fetchall()
    connection.close()
    return rows

@app.get("/crimeorderby/{order}/{direction}", response_model=List[CrimeData])
async def get_crimes_by_state(order: str, direction: str):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT *, LOWER(state) as lowerstate FROM crimeswomen ORDER BY %s %s", (order, direction))
    rows = cursor.fetchall()
    connection.close()
    return rows

