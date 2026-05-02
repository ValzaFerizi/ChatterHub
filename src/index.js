const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const initSocket = require('./socket/index');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = initSocket(server);

app.get('/', (req, res) => {
  res.json({ message: 'ChatterHub Server është aktiv ✅' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Serveri po dëgjon në port ${PORT}`);
});