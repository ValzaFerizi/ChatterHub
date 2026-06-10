const cursorSocket = (io, socket) => {
  // Kur përdoruesi lëviz kursorin në sheet
  socket.on('cursor:move', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cursor:updated', {
      userId: socket.id,
      username: socket.userData.username,
      position: {
        row: data.row,
        col: data.col
      }
    });
  });

  // Kur përdoruesi klikon një cell
  socket.on('cursor:click', (data) => {
    socket.to(`sheet:${data.sheetId}`).emit('cursor:clicked', {
      userId: socket.id,
      username: socket.userData.username,
      cellId: data.cellId
    });
  });

  // Kur përdoruesi lëviz kursorin në form
  socket.on('cursor:form_move', (data) => {
    socket.to(`form:${data.formId}`).emit('cursor:form_updated', {
      userId: socket.id,
      username: socket.userData.username,
      fieldId: data.fieldId
    });
  });

  // Kur përdoruesi shkëputet fshi kursorin
  socket.on('disconnect', () => {
    socket.broadcast.emit('cursor:removed', {
      userId: socket.id
    });
  });
};

module.exports = cursorSocket;