const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const initSocket = require('./socket/index');
const sheetRoutes = require('./routes/sheet.routes');
const formRoutes = require('./routes/form.routes');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const auditRoutes = require('./routes/auditRoutes');
const exportImportRoutes = require('./routes/exportImportRoutes');
const reportRoutes = require('./routes/reportRoutes');
const connectMongo = require('./config/mongo');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/sheets', sheetRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/export', exportImportRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ChatterHub Server është aktiv ✅' });
});

initSocket(server);
connectMongo();

const { sequelize } = require('./models');
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tabelat MySQL u krijuan'))
  .catch(err => console.warn('⚠️ MySQL:', err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Serveri po dëgjon në port ${PORT}`);
});