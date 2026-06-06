const http = require('http');
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const initSocket   = require('./socket/index');
const connectMongo = require('./config/mongo');

const authRoutes         = require('./routes/authRoutes');
const roleRoutes         = require('./routes/roleRoutes');
const auditRoutes        = require('./routes/auditRoutes');
const permissionRoutes   = require('./routes/permissionRoutes');
const exportImportRoutes = require('./routes/exportImportRoutes');
const reportRoutes       = require('./routes/reportRoutes');
const sheetRoutes        = require('./routes/sheet.routes');
const formRoutes         = require('./routes/form.routes');
const sectionRoutes      = require('./routes/section.routes');
const questionRoutes     = require('./routes/question.routes');
const responseRoutes     = require('./routes/response.routes');

const app    = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ChatterHub Server është aktiv ✅' });
});

app.use('/api/auth',        authRoutes);
app.use('/api/roles',       roleRoutes);
app.use('/api/audit',       auditRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/export',      exportImportRoutes);
app.use('/api/reports',     reportRoutes);
app.use('/api/sheets',      sheetRoutes);
app.use('/api/forms',       formRoutes);
app.use('/api/sections',    sectionRoutes);
app.use('/api/questions',   questionRoutes);
app.use('/api/responses',   responseRoutes);

initSocket(server);
connectMongo();

const { sequelize } = require('./models');
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tabelat u krijuan'))
  .catch(err => console.warn('⚠️ DB:', err.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Serveri po dëgjon në port ${PORT}`);
});