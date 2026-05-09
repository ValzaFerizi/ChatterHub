const formService = require('../services/form.service');

const formSocket = (io, socket) => {
  socket.on('form:join', (data) => {
    socket.join(`form:${data.formId}`);
    formService.createForm(data.formId);

    // Dërgo të dhënat e form-it tek përdoruesi i ri
    const form = formService.getForm(data.formId);
    socket.emit('form:data', { form });

    io.to(`form:${data.formId}`).emit('form:user_joined', {
      userId: socket.id,
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
    const response = formService.addResponse(
      data.formId,
      data.answers,
      socket.userData.username
    );

    io.to(`form:${data.formId}`).emit('form:submitted', {
      response,
      totalResponses: formService.getResponseCount(data.formId)
    });
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