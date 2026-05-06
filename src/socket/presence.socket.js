const presenceService = require('../services/presence.service');

const presenceSocket = (io, socket) => {
  // Kur përdoruesi bashkohet në një room
  socket.on('user:join', (userData) => {
    presenceService.addUser(socket.id, userData);
    
    // Bashkohu në room
    socket.join(userData.room);
    
    // Njofto të gjithë në room
    io.to(userData.room).emit('user:joined', {
      user: userData,
      activeUsers: presenceService.getActiveUsers()
    });

    console.log(`${userData.username} u bashkua në ${userData.room}`);
  });

  // Kur përdoruesi lëviz kursorin
  socket.on('cursor:move', (data) => {
    socket.to(data.room).emit('cursor:updated', {
      userId: socket.id,
      position: data.position
    });
  });
//Kur perdoruesi shkeputet
  socket.on('disconnect', () => {
    const user = presenceService.getUser(socket.id);
    if (user) {
      presenceService.removeUser(socket.id);
      io.to(user.room).emit('user:left', {
        user: user,
        activeUsers: presenceService.getActiveUsers()
      });
    }
  });
};

module.exports = presenceSocket;