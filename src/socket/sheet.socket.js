const sheetSocket = (io, socket) => {
  socket.on('sheet:join', (data) => {
    socket.join(`sheet:${data.sheetId}`);

    io.to(`sheet:${data.sheetId}`).emit('sheet:user_joined', {
      userId: socket.id,
      username: socket.userData.username,
      sheetId: data.sheetId
    });

    console.log(`${socket.userData.username} hapi sheet-in: ${data.sheetId}`);
  });

  socket.on('cell:update', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cell:updated', {
      cellId: data.cellId,
      value: data.value,
      updatedBy: socket.userData.username,
      updatedAt: new Date()
    });

    console.log(`Cell ${data.cellId} u ndryshua nga ${socket.userData.username}`);
  });

  socket.on('cell:editing', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cell:being_edited', {
      cellId: data.cellId,
      editedBy: socket.userData.username,
      userId: socket.id
    });
  });

  socket.on('cell:leave', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cell:edit_stopped', {
      cellId: data.cellId,
      userId: socket.id
    });
  });

  socket.on('sheet:leave', (data) => {
    socket.leave(`sheet:${data.sheetId}`);

    io.to(`sheet:${data.sheetId}`).emit('sheet:user_left', {
      userId: socket.id,
      username: socket.userData.username
    });
  });
};

module.exports = sheetSocket;