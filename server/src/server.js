const app = require('./app');
const { sequelize } = require('./src/models'); // corrected path if models are in src/models
require('dotenv').config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error('❌ Unable to start server:', e.message);
    process.exit(1);
  }
})();
