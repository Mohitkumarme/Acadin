require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/industry', require('./routes/industry'));
app.use('/api/academician', require('./routes/academician'));
app.use('/api/institution', require('./routes/institution'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/learning', require('./routes/learning'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Acadin API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
