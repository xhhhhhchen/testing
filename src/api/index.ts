import type { Device } from "../types";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// // User Registration
// export const registerUser = async (userData: {
//   name: string;
//   email: string;
//   password: string;
//   location?: string;
//   tank_id: string;
// }) => {
//   const response = await fetch(`${API_URL}/auth/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(userData),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || 'Registration failed');
//   }

//   return response.json();
// };

// // User Login
// export const loginUser = async (credentials: {
//   email: string;
//   password: string;
// }) => {
//   const response = await fetch(`${API_URL}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(credentials),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || 'Login failed');
//   }

//   return response.json();
// };

// Get All Locations
export const getAllLocations = async () => {
  const response = await fetch(`${API_URL}/tanks/location`);
  if (!response.ok) throw new Error('Failed to fetch locations');
  return response.json();
};

// Get Tanks by Location ID
export const getTanksByLocation = async (locationId: string) => {
  const response = await fetch(`${API_URL}/tanks/tanksname?locationId=${locationId}`);
  if (!response.ok) throw new Error('Failed to fetch tanks for selected location');
  return response.json();
};




export async function getTanksByIds(ids: string[]): Promise<Device[]> {
  try {
    const response = await fetch(`/api/tanks/tankinfo?ids=${ids.join(',')}`);
    if (!response.ok) throw new Error('Failed to fetch tanks');
    return await response.json();
  } catch (error) {
    console.error('Tank fetch error:', error);
    return [];
  }
}
