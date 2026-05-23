const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

const { config } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { notFoundHandler } = require('./middleware/notFoundHandler');

const app = express();
const corsOptions = {
  origin: config.cors.origins,
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/health`, healthRoutes);
app.use(`${config.apiPrefix}/users`, userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
