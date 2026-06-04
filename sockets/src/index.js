const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const initSocket = require('./socket/index');
const sheetRoutes = require('./routes/sheet.routes');
const formRoutes = require('./routes/form.routes');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sheets', sheetRoutes);
app.use('/api/forms', formRoutes);

// Route bazë për të testuar
app.get('/', (req, res) => {
  res.json({ message: 'ChatterHub Server është aktiv ✅' });
});

// Inicializo Socket.IO
const io = initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Serveri po dëgjon në port ${PORT}`);
});