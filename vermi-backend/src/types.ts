// src/types.ts

// ======================
// Core User Types
// ======================
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string; // ISO date string
  last_login?: string; // ISO date string
}

export interface UserWithCredentials extends User {
  password_hash: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  location?: string;
  device_id?: string; // Changed from tank_id to match your DB
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ======================
// Device/Tank Types
// ======================
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  description?: string;
  location_id: string;
  bearer_token?: string;
  status: 'active' | 'maintenance' | 'retired';
  created_at: string;
}

export interface DeviceType {
  id: string;
  name: string; // 'Tank', 'Sensor', etc.
  description?: string;
}

// ======================
// Location Types
// ======================
export interface Location {
  id: string;
  name: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// ======================
// API Response Types
// ======================
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// ======================
// Form/UI Types
// ======================
export interface DeviceSelection {
  id: string;
  name: string;
  location: string;
}

// For your login/register forms
export interface AuthFormState {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  selectedDevice?: DeviceSelection;
}

// ======================
// Error Types
// ======================
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string>;
}

// Type guard for API errors
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error
  );
}

export interface DeviceInfo {
  device_id: string;       // Matches your Devices.DeviceID
  name: string;           // Devices.DeviceName
  type: string;           // Derived from DeviceTypes
  description?: string;   // Devices.DeviceDescription
  location: {
    id: number;          // Locations.LocationID
    name: string;        // Locations.LocationName
    description?: string // Locations.LocationDescription
  };
  bearer_token?: string;  // Devices.BearerToken
  status?: 'active' | 'maintenance' | 'inactive';
}
