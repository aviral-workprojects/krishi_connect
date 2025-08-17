const express = require('express');
const cors = require('cors');
const routesAuth = require('./routes/auth.routes');
const routesFarmer = require('./routes/farmer.routes');
const routesBuyer = require('./routes/buyer.routes');
const routesOrder = require('./routes/order.routes');
const mlRoutes = require("./routes/mlRoutes");
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', routesAuth);
app.use('/api/farmers', routesFarmer);
app.use('/api/buyers', routesBuyer);
app.use('/api/orders', routesOrder);
app.use("/api/ml", mlRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});
app.get('/', (req, res) => {
  res.send('🌾 Welcome to Krishi Connect API! Server is running.');
});

module.exports = app;
