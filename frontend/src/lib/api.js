import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// withCredentials ensures the httpOnly auth cookie is sent with requests.
// Tokens are NEVER stored in localStorage (XSS-safe) — the server manages
// a secure, httpOnly cookie instead.
const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

export default api;
