// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const supabase = require('../db/supabaseClient');

// const registerUser = async (req, res) => {
//   const { name, email, password, location_id, location_name, tank_ids } = req.body;

//   try {
//     // Validate required fields
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         message: 'Name, email, and password are required',
//         field: !name ? 'name' : !email ? 'email' : 'password'
//       });
//     }

//     // Check if user exists
//     const { data: existingUser, error: checkError } = await supabase
//       .from('users')
//       .select('user_id')
//       .eq('email', email)
//       .maybeSingle();

//     if (checkError) throw checkError;
//     if (existingUser) {
//       return res.status(400).json({
//         message: 'User already exists. Try logging in instead.',
//         field: 'email'
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Insert new user
//     const { data: newUser, error: insertError } = await supabase
//       .from('users')
//       .insert([{
//         username: name,
//         email,
//         password_hash: hashedPassword,
//         location_id,
//         location_name
//       }])
//       .select()
//       .single();

//     if (insertError) throw insertError;

//     const userId = newUser.user_id;

//     // Insert tank_ids if provided
//     if (Array.isArray(tank_ids) && tank_ids.length > 0) {
//       const tankRows = tank_ids.map(tank_id => ({ user_id: userId, tank_id }));
//       const { error: tankInsertError } = await supabase
//         .from('user_tanks')
//         .insert(tankRows);

//       if (tankInsertError) console.warn('Tank insert error:', tankInsertError.message);
//     }

//     // Create JWT
//     const token = jwt.sign(
//       { id: userId, email: newUser.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );

//     res.status(201).json({
//       user: {
//         id: userId,
//         name: newUser.username,
//         email: newUser.email,
//         location: newUser.location_id,
//         location_name: newUser.location_name,
//         created_at: newUser.created_at
//       },
//       token
//     });

//   } catch (error) {
//     console.error('Registration error:', error.stack || error);
//     res.status(500).json({
//       message: 'Registration failed',
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({
//         message: 'Email and password are required',
//         field: !email ? 'email' : 'password'
//       });
//     }

//     // Check if user exists
//     const { data: user, error: userError } = await supabase
//       .from('users')
//       .select('user_id, username, email, password_hash, location_id, created_at')
//       .eq('email', email)
//       .single();

//     if (userError) {
//       if (userError.code === 'PGRST116') { // row not found
//         return res.status(401).json({
//           message: 'Invalid credentials',
//           field: 'email'
//         });
//       }
//       throw userError;
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return res.status(401).json({
//         message: 'Invalid credentials',
//         field: 'password'
//       });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       { id: user.user_id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '30d' }
//     );

//     res.json({
//       user: {
//         id: user.user_id,
//         name: user.username,
//         email: user.email,
//         location: user.location_id,
//         created_at: user.created_at
//       },
//       token
//     });
// x
//   } catch (error) {
//     console.error('Login error:', error.stack || error);
//     res.status(500).json({
//       message: 'Login failed',
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

// module.exports = { registerUser, loginUser };
