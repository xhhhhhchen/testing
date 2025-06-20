const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query: userQuery } = require('../db/userDb');

const registerUser = async (req, res) => {
  const { name, email, password, location, tank_id } = req.body;
  
  try {
    // Check if user exists
    const userExists = await userQuery('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        message: 'User already exists. Try logging in instead.',
        field: 'email'
      });
    }

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, and password are required',
        field: !name ? 'name' : !email ? 'email' : 'password'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await userQuery(
      `INSERT INTO users 
      (username, email, password_hash, location, tankid) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING user_id, username, email, location, tankid, created_at`,
      [name, email, hashedPassword, location || null, tank_id || null]
    );


    // Create JWT token
    const token = jwt.sign(
      { 
        id: newUser.rows[0].id,
        email: newUser.rows[0].email
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      user: {
        id: newUser.rows[0].user_id,
        name: newUser.rows[0].username,
        email: newUser.rows[0].email,
        location: newUser.rows[0].location,
        tank_id: newUser.rows[0].tankid,
        created_at: newUser.rows[0].created_at
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        field: !email ? 'email' : 'password'
      });
    }

    // Check if user exists
    const user = await userQuery(
      `SELECT user_id, username, email, password_hash, location, tankid, created_at 
      FROM users WHERE email = $1`,
      [email]
    );

    
    if (user.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        field: 'email'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        field: 'password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.rows[0].user_id,
        email: user.rows[0].email
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );


    // Omit password from response
    const { password_hash: _, ...userData } = user.rows[0];

    res.json({
      user: {
        id: userData.user_id,
        name: userData.username,
        email: userData.email,
        location: userData.location,
        tank_id: userData.tankid,
        created_at: userData.created_at
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { registerUser, loginUser };