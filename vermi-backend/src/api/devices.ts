import type { DeviceInfo } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const getAvailableDevices = async (): Promise<DeviceInfo[]> => {
  try {
    const response = await fetch(`${API_BASE}/tanks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid devices data format');
    }

    return data.map((device: any) => ({
      device_id: device.id,
      name: device.name,
      description: device.description,
      location: {
        id: device.location_id,
        name: device.location,
        description: ''
      },
      bearer_token: device.bearer_token
    })) as DeviceInfo[];
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    throw new Error('Unable to retrieve devices. Please try again later.');
  }
};
