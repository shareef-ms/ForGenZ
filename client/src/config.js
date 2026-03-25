// Create a file: src/config.js
const API = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;
export default API;
