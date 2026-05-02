const { Server } = require('socket.io');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Përdoruesi u lidh: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Përdoruesi u shkëput: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;