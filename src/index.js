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

const backendFormRoutes     = require('../backend/src/routes/form.routes');
const backendSectionRoutes  = require('../backend/src/routes/section.routes');
const backendQuestionRoutes = require('../backend/src/routes/question.routes');
const backendResponseRoutes = require('../backend/src/routes/response.routes');

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

app.use('/api/forms',     backendFormRoutes);
app.use('/api/sections',  backendSectionRoutes);
app.use('/api/questions', backendQuestionRoutes);
app.use('/api/responses', backendResponseRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ChatterHub Server është aktiv ✅' });
});

initSocket(server);
connectMongo();

const { sequelize } = require('./models');
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tabelat MySQL u krijuan'))
  .catch(err => console.warn('⚠️ MySQL:', err.message));

const backendDb = require('../backend/src/models');
backendDb.sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tabelat Forms u krijuan'))
  .catch(err => console.warn('⚠️ Backend DB:', err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Serveri po dëgjon në port ${PORT}`);
});