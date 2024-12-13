require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const morganMiddleware = require('./middlewares/morganMiddleware');
const tooBusy = require('./utils/tooBusy');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(morgan('dev'));
app.use(tooBusy);

// path to uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', routes);

// Check Health route
app.get('/api/health', (req, res) => {
  res.json({ status: '✅' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
