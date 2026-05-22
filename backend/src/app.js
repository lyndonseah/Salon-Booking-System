const cors = require('cors');
const express = require('express');

const { config } = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { notFoundHandler } = require('./middleware/notFoundHandler');

const app = express();
const corsOptions = {
  origin: config.cors.origins,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.use(`${config.apiPrefix}/health`, healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
