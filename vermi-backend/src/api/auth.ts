// const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// // Auth endpoints
// export const registerUser = async (userData: {
//   name: string;
//   email: string;
//   password: string;
//   tank_id: string;  // renamed to match backend
//   location?: string;
// }) => {
//   const response = await fetch(`${API_BASE}/auth/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(userData),
//   });

//   if (!response.ok) {
//     const errText = await response.text();
//     throw new Error(errText);
//   }

//   return response.json();
// };

// export const loginUser = async (credentials: {
//   email: string;
//   password: string;
// }) => {
//   const response = await fetch(`${API_BASE}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(credentials),
//   });

//   if (!response.ok) {
//     const errText = await response.text();
//     throw new Error(errText);
//   }

//   return response.json();
// };
