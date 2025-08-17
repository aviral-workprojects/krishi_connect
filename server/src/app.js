const express = require('express');
const cors = require('cors');
const routesAuth = require('./src/routes/auth.routes');
const routesFarmer = require('./src/routes/farmer.routes');
const routesBuyer = require('./src/routes/buyer.routes');
const routesOrder = require('./src/routes/order.routes');
const mlRoutes = require("./src/routes/mlRoutes");
require('dotenv').config();

const app = express();

// safer CORS config
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ["*"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', routesAuth);
app.use('/api/farmers', routesFarmer);
app.use('/api/buyers', routesBuyer);
app.use('/api/orders', routesOrder);
app.use("/api/ml", mlRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
