const presenceService = require('../services/presence.service');

const presenceSocket = (io, socket) => {
  socket.on('form:join', (data) => {
    presenceService.addUser(socket.id, {
      username: socket.userData.username,
      formId: data.formId
    });

    io.to(`form:${data.formId}`).emit('presence:form_users', {
      users: presenceService.getUsersByForm(data.formId)
    });
  });

  socket.on('sheet:join', (data) => {
    presenceService.addUser(socket.id, {
      username: socket.userData.username,
      sheetId: data.sheetId
    });

    io.to(`sheet:${data.sheetId}`).emit('presence:sheet_users', {
      users: presenceService.getUsersBySheet(data.sheetId)
    });
  });

  socket.on('disconnect', () => {
    const user = presenceService.getUser(socket.id);
    if (user) {
      presenceService.removeUser(socket.id);

      if (user.formId) {
        io.to(`form:${user.formId}`).emit('presence:form_users', {
          users: presenceService.getUsersByForm(user.formId)
        });
      }

      if (user.sheetId) {
        io.to(`sheet:${user.sheetId}`).emit('presence:sheet_users', {
          users: presenceService.getUsersBySheet(user.sheetId)
        });
      }
    }
  });
};

module.exports = presenceSocket;