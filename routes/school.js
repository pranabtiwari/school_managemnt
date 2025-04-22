
const express = require('express');
const router = express.Router();
const pool = require('../config/db');


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = degree => degree * (Math.PI / 180);
  const R = 6371; // Radius of Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};


router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

 
  if (!name || !address || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
  }

  try {
    const query = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [name, address, latitude, longitude];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'School added successfully', school: result.rows[0] });
  } catch (err) {
    console.error('Error adding school:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/listSchools', async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: 'Valid latitude and longitude are required' });
  }

  try {
    const query = 'SELECT * FROM schools';
    const result = await pool.query(query);

    const schoolsWithDistance = result.rows.map(school => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance: parseFloat(distance.toFixed(2)) };
    });

   
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (err) {
    console.error('Error fetching schools:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
