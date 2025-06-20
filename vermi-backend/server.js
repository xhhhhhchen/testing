require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const tankRoutes = require('./routes/tankRoutes');
console.log('Imported tankRoutes:', require('./routes/tankRoutes'));

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true
}));

app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tanks', tankRoutes);

app.get('/__debug', (req, res) => {
  res.json({ ok: true, source: 'backend' });
});


//testing
// app.get('/test', (req, res) => {
//   res.send('Hello from test route!');
// });


const PORT = process.env.PORT || 8080; // was 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));