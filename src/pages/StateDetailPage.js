  import React, { useState, useEffect } from 'react';
  import { useParams } from 'react-router-dom';
  import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip 
  } from 'recharts';
  import { fetchCrimes } from '../services/apiService';

  const StateDetailPage = () => {
    const { stateName } = useParams();
    const [stateData, setStateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadStateData = async () => {
        try {
          // Fetch all crimes and filter for specific state
          fetchCrimes(stateName.toLowerCase())
          .then(response => {
            const stateCrimes = response.data;
  
            // Process data for visualization
            const processedData = processStateData(stateCrimes);
          
            setStateData(processedData);
            setLoading(false);
          })
          .catch(error => console.error("Error fetching data:", error));
        } catch (error) {
          console.error(`Failed to load ${stateName} data`, error);
          setLoading(false);
        }
      };

      loadStateData();
    }, [stateName]);

    // Data processing function
    const processStateData = (crimes) => {
      // Group crimes by year
      const yearlyData = crimes.reduce((acc, crime) => {
        const existingYear = acc.find(y => y.year === crime.year);
      
        if (existingYear) {
          existingYear.total_crimes += calculateTotalCrimes(crime);
        } else {
          acc.push({
            year: crime.year,
            total_crimes: calculateTotalCrimes(crime),
            rape: crime.rape,
            ka: crime.ka,
            dd: crime.dd,
            aow: crime.aow,
            aom: crime.aom,
            dv: crime.dv,
            wt: crime.wt,
          });
        }
      
        return acc;
      }, []);

        return {
        name: stateName,
        yearlyTrend: yearlyData.sort((a, b) => a.year - b.year),
        crimeTypes: [
          { type: 'Rape', count: crimes.reduce((sum, crime) => sum + (crime.rape || 0), 0) },
          { type: 'Kidnapping', count: crimes.reduce((sum, crime) => sum + (crime['ka'] || 0), 0) },
          { type: 'Dowry', count: crimes.reduce((sum, crime) => sum + (crime['dd'] || 0), 0) },
          { type: 'Assault', count: crimes.reduce((sum, crime) => sum + (crime['aow'] || 0), 0) },
          { type: 'Modesty', count: crimes.reduce((sum, crime) => sum + (crime['aom'] || 0), 0) },
          { type: 'Domestic Violence', count: crimes.reduce((sum, crime) => sum + (crime['dv'] || 0), 0) },
          { type: 'Women Trafficking', count: crimes.reduce((sum, crime) => sum + (crime['wt'] || 0), 0) },
        ]
      };
    };

    // Reuse total crimes calculation
    const calculateTotalCrimes = (item) => {
      const crimeFields = ['rape', 'ka', 'dd', 'aow', 'aom', 'dv', 'wt'];
      return crimeFields.reduce((total, field) => {
        return total + (Number(item[field]) || 0);
      }, 0);
    };

    if (loading) return <div>Loading state data...</div>;

    return (
      <div className="state-detail-page">
        <h1 className='state-crime-heading'>{stateName} Crime Statistics</h1>
      
        {/* Total Crimes Trend Chart */}
        <section className="yearly-trend">
          <div>
          <h2>Year</h2>
          <span>Total Crimes</span>
          <BarChart width={500} height={200} data={stateData.yearlyTrend} barSize={20}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_crimes" fill="#8884d8" />
          </BarChart>
          </div>
        </section>

        {/* Rape Trend Chart */}
        <section className="yearly-trend">
          <div>
            <h2>Rape</h2>
            <span>No. Of Rape Cases</span>
            <BarChart width={500} height={200} data={stateData.yearlyTrend}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rape" fill="#8884d8" />
            </BarChart>
          </div>
        </section>

        {/* K&A Trend Chart */}
        <section className="yearly-trend">
          <div>
            <h2>K&A</h2>
            <span>Kidnapping and Abduction cases</span>
            <BarChart width={500} height={200} data={stateData.yearlyTrend}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ka" fill="#8884d8" />
            </BarChart>
          </div>
        </section>

        {/* DD Trend Chart */}
        <section className="yearly-trend">
          <div>
            <h2>DD</h2>
            <span>Dowry Deaths</span>
            <BarChart width={500} height={200} data={stateData.yearlyTrend}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="dd" fill="#8884d8" />
            </BarChart>
          </div>
        </section>

        {/* AoW Trend Chart */}
        <section className="yearly-trend">
         <div>
            <h2>AoW</h2>
            <span>Assault against Women</span>
            <BarChart width={500} height={200} data={stateData.yearlyTrend}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="aow" fill="#8884d8" />
            </BarChart>
          </div>
        </section>

        {/* AoW Trend Chart */}
        <section className="yearly-trend">
          <div>
            <h2>AoM</h2>
            <span>Assault against Modesty of Women</span>
            <BarChart width={500} height={200} data={stateData.yearlyTrend}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="aom" fill="#8884d8" />
            </BarChart>
          </div>
        </section>

        {/* DV Trend Chart */}
        <section className="yearly-trend">
        <div>
          <h2>DV</h2>
          <span>Domestic Violence</span>
          <BarChart width={500} height={200} data={stateData.yearlyTrend}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="dv" fill="#8884d8" />
          </BarChart>
          </div>
        </section>

        {/* DV Trend Chart */}
        <section className="yearly-trend">
        <div>
          <h2>WT</h2>
          <span>Women Trafficking</span>
          <BarChart width={600} height={200} data={stateData.yearlyTrend}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="wt" fill="#8884d8" />
          </BarChart>
          </div>
        </section>

        {/* Crime Types Breakdown */}
        <section className="yearly-trend">
          <h2>Crime Types Breakdown</h2>
          <BarChart width={1000} height={200} data={stateData.crimeTypes}>
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </section>
      </div>
    );
  };

  export default StateDetailPage;