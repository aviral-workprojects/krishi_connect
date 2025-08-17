import axios from "axios";

// Base URL comes from env var (set in .env or .env.production)
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Pre-configured axios instance
const api = axios.create({
  baseURL: API,
  withCredentials: true, // if you’re using cookies/sessions
});

// Export for use everywhere
export default api;
