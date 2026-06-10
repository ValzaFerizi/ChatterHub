const formService = require('../services/form.service');

const formSocket = (io, socket) => {

  socket.on('form:join', (data) => {
    socket.join(`form:${data.formId}`);

    const form = formService.createForm(data.formId);
    socket.emit('form:data', { form });

    io.to(`form:${data.formId}`).emit('form:user_joined', {
      userId: socket.userData.id,
      username: socket.userData.username,
      formId: data.formId
    });
  });

  socket.on('field:update', (data) => {
    const updatedField = formService.updateField(
      data.formId,
      data.fieldId,
      data.value,
      socket.userData.username
    );

    io.to(`form:${data.formId}`).emit('field:updated', {
      fieldId: data.fieldId,
      ...updatedField
    });
  });

  socket.on('form:submit', (data) => {
    try {
      const response = formService.addResponse(
        data.formId,
        data.answers,
        socket.userData.id
      );

      const totalResponses = formService.getResponseCount(data.formId);

      io.to(`form:${data.formId}`).emit('form:submitted', {
        response,
        totalResponses
      });

    } catch (err) {
      socket.emit('form:error', { message: 'Gabim gjate dergimit te formes.' });
    }
  });

  socket.on('field:typing', (data) => {
    socket.to(`form:${data.formId}`).emit('field:being_typed', {
      fieldId: data.fieldId,
      typedBy: socket.userData.username,
      userId: socket.id
    });
  });

  socket.on('form:leave', (data) => {
    socket.leave(`form:${data.formId}`);
    io.to(`form:${data.formId}`).emit('form:user_left', {
      userId: socket.id,
      username: socket.userData.username
    });
  });
};

module.exports = formSocket;