const { Server } = require('socket.io');
const presenceSocket = require('./presence.socket');
const notificationSocket = require('./notification.socket');
const socketMiddleware = require('../middleware/socket.middleware');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use(socketMiddleware);

  io.on('connection', (socket) => {
    console.log(`Përdoruesi u lidh: ${socket.id}`);

    presenceSocket(io, socket);
    notificationSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`Përdoruesi u shkëput: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;