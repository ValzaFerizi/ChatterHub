const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const auditRoutes = require('./routes/auditRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const { connectRedis } = require('./config/redisClient');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/permissions', permissionRoutes);

app.get('/', (req, res) => {
  res.send('ChatterHub API is running!');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectRedis();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});