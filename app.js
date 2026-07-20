const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables and connect to MongoDB.

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});
app.get('/login', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'login.html'));
});
app.get('/register', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'register.html'));
});
app.get('/dashboard', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dashboard.html'));
});
app.get('/members', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'members.html'));
});
app.get('/trainers', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'trainers.html'));
});
app.get('/payments', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'payments.html'));
});
app.get('/attendance', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'attendance.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(require('./middleware/errorHandler'));

module.exports = app;
