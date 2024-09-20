// src/api.js
import axios from 'axios';

// Create an axios instance with the base URL from the .env file
const api = axios.create({
  baseURL: 'http://localhost:5000' , 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Export the axios instance to be used across your app
export default api;
