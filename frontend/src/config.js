// Production/ephemeral note:
// Empty string means "same origin". With ALB + frontend nginx, API requests are proxied to the backend container.
// For future domain split, set REACT_APP_API_URL=https://api.example.com during the frontend build.
const API_BASE_URL = process.env.REACT_APP_API_URL ?? "";
export default API_BASE_URL;
