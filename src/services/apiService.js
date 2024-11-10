import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const fetchCrimes = (statename='') => {
  return axios.get(`${BASE_URL}/crimes/${statename}`);
};

export const fetchAggregatedCrimeData = () => {
  return axios.get(`${BASE_URL}/crimesaggregated`);
};
