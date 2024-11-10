import React, { useState, useEffect } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Legend 
  } from 'recharts';
import Table from "../components/SortableTable";
import { fetchCrimes, fetchAggregatedCrimeData } from '../services/apiService';

function Home() {
  const [crimeData, setCrimeData] = useState([]);
  const [aggregatedCrimeData, setAggregatedCrimeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [state, setState] = useState("");

const loadCrimeData = async (data) => {
    // Transform data to match our desired structure
    const processedData = data.map(item => ({
        state: item.state || 'Unknown', // Use 'State' with capital S
        total_crimes: calculateTotalCrimes(item),
        rape_cases: item.rape || 0,
        year: item.year || 'N/A'
    }));

    // Group by state and aggregate data
    const aggregatedData = aggregateByState(processedData);

    setFilteredData(aggregatedData);
};

  // Calculate total crimes from available fields
  const calculateTotalCrimes = (item) => {
    const crimeFields = ['rape', 'ka', 'dd', 'aow', 'aom', 'dv', 'wt'];
    return crimeFields.reduce((total, field) => total + (Number(item[field]) || 0), 0);
  };

  // Aggregate data by state
  const aggregateByState = (data) => {
    const stateAggregation = data.reduce((acc, item) => {
      const existingState = acc.find(s => s.state.toLowerCase() === item.state.toLowerCase());
      
      if (existingState) {
        existingState.total_crimes += item.total_crimes;
        existingState.rape_cases += item.rape_cases;
      } else {
        acc.push({
          state: item.state,
          total_crimes: item.total_crimes,
          rape_cases: item.rape_cases
        });
      }
      
      return acc;
    }, []);

    return stateAggregation;
  };

  // Fetch crime data from the API
  useEffect(() => {
    fetchCrimes()
      .then(response => {
        loadCrimeData(response.data)
        setCrimeData(response.data)
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Fetch aggregated crime data from the backend
  useEffect(() => {
    fetchAggregatedCrimeData()
    .then(response => {
        setAggregatedCrimeData(response.data);
      })
    .catch(error => console.error("Error fetching aggregated crime data", error));
  }, []);

  // Filter crime data by state
  const filterByState = () => {
    if (state) {
      fetchCrimes(state)
      .then(response => {
        loadCrimeData(response.data)
        setCrimeData(response.data)
      })
        .catch(error => console.error("Error fetching data:", error));
    } else {
      fetchCrimes()
      .then(response => {
        loadCrimeData(response.data)
        setCrimeData(response.data)
      })
        .catch(error => console.error("Error fetching data:", error));
    }
  };

  return (
    <div className="App">
      <h1>India Crime Against Women Dashboard</h1>

      {/* Filter by State */}
      <div className='search-container'>
          <input
          type="text"
          placeholder="Enter State"
          className='search-input'
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <button onClick={filterByState}>Filter</button>
      </div>

      <h2>Crime Rates by State</h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={aggregatedCrimeData}>
            <XAxis dataKey="state" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="crime_rate" 
              fill="#82ca9d" 
              name="Crime Rates" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Crime Chart */}
      <h2>Crime Statistics by State</h2>
      {/* Bar Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={filteredData}>
            <XAxis dataKey="state" />
            <YAxis 
              label={{ 
                value: 'Number of Crimes', 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="total_crimes" 
              fill="#8884d8" 
              name="Total Crimes" 
            />
            <Bar 
              dataKey="rape_cases" 
              fill="#82ca9d" 
              name="Rape Cases" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Crime Data</h2>
      <div className='table-responsive'>
       <Table data={crimeData} />
       </div>
    </div>
  );
}

export default Home;
