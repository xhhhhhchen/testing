// const express = require('express');
// const { registerUser, loginUser } = require('../controllers/authController');

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// const { query: userQuery } = require('../db/userDb');

// router.get('/debug-db', async (req, res) => {
//   try {
//     const result = await userQuery('SELECT NOW()'); // Simple query
//     res.json({ success: true, result: result.rows[0] });
//   } catch (error) {
//     console.error('DB connection error:', error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;

