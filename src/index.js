const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { sequelize } = require('./models');
const connectMongo = require('./config/mongo');

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const auditRoutes = require('./routes/auditRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/permissions', permissionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ChatterHub API is running!' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectMongo();
    await sequelize.sync({ alter: true });
    console.log('MySQL connected and tables synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
