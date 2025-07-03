// tankController.js
const { query: tankQuery } = require('../db/tankDb');

// // Get all available devices (tanks) with location names
// const getAvailableDevices = async (req, res) => {
//   try {
//     const result = await tankQuery(`
//       SELECT 
//         d.DeviceID AS id,
//         d.DeviceName,
//         d.DeviceDescription,
//         l.LocationName AS location,
//         l.LocationID,
//         d.BearerToken
//       FROM Devices d
//       JOIN Locations l ON d.LocationID = l.LocationID
//     `);

//     res.json(result.rows.map(device => ({
//       id: device.id,
//       name: device.devicename,
//       description: device.devicedescription,
//       location: device.location,
//       location_id: device.locationid,
//       bearer_token: device.bearertoken
//     })));
//   } catch (error) {
//     console.error('Error fetching devices:', error);
//     res.status(500).json({ 
//       message: 'Error fetching available devices',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// Get tanks by location
const getTanksByLocation = async (req, res) => {
  const { locationId } = req.query;
  if (!locationId) return res.status(400).json({ message: 'locationId is required' });

  try {
    const result = await tankQuery(`
      SELECT 
        DeviceID AS id,
        DeviceName AS name,
        DeviceDescription AS description
      FROM Devices
      WHERE LocationID = $1
    `, [locationId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tanks by location:', error);
    res.status(500).json({ 
      message: 'Error fetching tanks by location',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get distinct locations
const getAllLocations = async (req, res) => {
  try {
    const result = await tankQuery(`
      SELECT DISTINCT LocationID AS id, LocationName AS name
      FROM Locations
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ 
      message: 'Error fetching locations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const getTanksByIds = async (req, res) => {
  const idsParam = req.query.ids;
  if (!idsParam) return res.status(400).json({ message: 'ids query param is required' });

  const ids = idsParam.split(',').map(id => parseInt(id, 10));


  try {
    const result = await tankQuery(`
      SELECT 
        DeviceID AS id,
        DeviceName AS name,
        DeviceDescription AS description,
        LocationID AS location_id
      FROM Devices
      WHERE DeviceID = ANY($1::int[])
    `, [ids]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tanks by ids:', error);
    res.status(500).json({ 
      message: 'Error fetching tanks by ids',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



module.exports = {
  // getAvailableDevices,
  getTanksByLocation,
  getAllLocations,
  getTanksByIds
};



