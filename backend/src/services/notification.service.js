const notificationService = {
  sendToUser: (io, socketId, type, message) => {
    io.to(socketId).emit('notification', {
      type,
      message,
      createdAt: new Date()
    });
  },

  sendToRoom: (io, room, type, message) => {
    io.to(room).emit('notification', {
      type,
      message,
      createdAt: new Date()
    });
  },

  sendToAll: (io, type, message) => {
    io.emit('notification', {
      type,
      message,
      createdAt: new Date()
    });
  }
};

module.exports = notificationService;