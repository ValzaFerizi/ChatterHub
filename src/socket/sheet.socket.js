const sheetService = require('../services/sheet.service');

const sheetSocket = (io, socket) => {
  // Kur përdoruesi hap një sheet
  socket.on('sheet:join', (data) => {
    socket.join(`sheet:${data.sheetId}`);

    // Krijo sheet nëse nuk ekziston
    sheetService.createSheet(data.sheetId);

    // Dërgo të gjitha cells tek përdoruesi i ri
    const cells = sheetService.getAllCells(data.sheetId);
    socket.emit('sheet:data', { cells });

    // Njofto të gjithë që ky person është duke edituar
    io.to(`sheet:${data.sheetId}`).emit('sheet:user_joined', {
      userId: socket.id,
      username: socket.userData.username,
      sheetId: data.sheetId
    });

    console.log(`${socket.userData.username} hapi sheet-in: ${data.sheetId}`);
  });

  // Kur përdoruesi ndryshon një cell
  socket.on('cell:update', (data) => {
    // Ruaj ndryshimin në service
    const updatedCell = sheetService.updateCell(
      data.sheetId,
      data.cellId,
      data.value,
      socket.userData.username
    );

    // Dërgo ndryshimin tek të gjithë në sheet
    io.to(`sheet:${data.sheetId}`).emit('cell:updated', {
      cellId: data.cellId,
      ...updatedCell
    });

    console.log(`Cell ${data.cellId} u ndryshua nga ${socket.userData.username}`);
  });

  // Kur përdoruesi fillon të editojë një cell
  socket.on('cell:editing', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cell:being_edited', {
      cellId: data.cellId,
      editedBy: socket.userData.username,
      userId: socket.id
    });
  });

  // Kur përdoruesi lë një cell
  socket.on('cell:leave', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cell:edit_stopped', {
      cellId: data.cellId,
      userId: socket.id
    });
  });

  // Kur përdoruesi lë sheet-in
  socket.on('sheet:leave', (data) => {
    socket.leave(`sheet:${data.sheetId}`);

    io.to(`sheet:${data.sheetId}`).emit('sheet:user_left', {
      userId: socket.id,
      username: socket.userData.username
    });
  });
};

module.exports = sheetSocket;