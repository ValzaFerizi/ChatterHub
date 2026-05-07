const formSocket = (io, socket) => {
  socket.on('form:join', (data) => {
    socket.join(`form:${data.formId}`);

    io.to(`form:${data.formId}`).emit('form:user_joined', {
      userId: socket.id,
      username: socket.userData.username,
      formId: data.formId
    });

    console.log(`${socket.userData.username} hapi form-in: ${data.formId}`);
  });

  socket.on('field:update', (data) => {
    socket.to(`form:${data.formId}`).emit('field:updated', {
      fieldId: data.fieldId,
      value: data.value,
      updatedBy: socket.userData.username,
      updatedAt: new Date()
    });

    console.log(`Field ${data.fieldId} u plotësua nga ${socket.userData.username}`);
  });

  socket.on('form:submit', (data) => {
    io.to(`form:${data.formId}`).emit('form:submitted', {
      formId: data.formId,
      submittedBy: socket.userData.username,
      answers: data.answers,
      submittedAt: new Date()
    });

    console.log(`Form ${data.formId} u dërgua nga ${socket.userData.username}`);
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