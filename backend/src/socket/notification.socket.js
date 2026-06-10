const notificationService = require('../services/notification.service');

const notificationSocket = (io, socket) => {
  // Dërgo njoftim tek një përdorues specifik
  socket.on('notification:send', (data) => {
    notificationService.sendToUser(
      io,
      data.targetSocketId,
      data.type,
      data.message
    );
  });

  // Dërgo njoftim tek të gjithë në room
  socket.on('notification:room', (data) => {
    notificationService.sendToRoom(
      io,
      data.room,
      data.type,
      data.message
    );
  });

  // Dërgo njoftim tek të gjithë
  socket.on('notification:all', (data) => {
    notificationService.sendToAll(
      io,
      data.type,
      data.message
    );
  });

  // Njoftim kur dikush fillon të shkruajë
  socket.on('user:typing', (data) => {
    socket.to(data.room).emit('user:typing', {
      userId: socket.id,
      username: data.username,
      isTyping: data.isTyping
    });
  });
};

module.exports = notificationSocket;