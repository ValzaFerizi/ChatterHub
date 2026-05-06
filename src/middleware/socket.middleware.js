const socketMiddleware = (socket, next) => {
  // Merr token nga query parameters
  const token = socket.handshake.query.token;
  const username = socket.handshake.query.username;
  const room = socket.handshake.query.room;

  // Kontrollo nëse ka username
  if (!username) {
    return next(new Error('Username mungon!'));
  }

  // Kontrollo nëse ka room
  if (!room) {
    return next(new Error('Room mungon!'));
  }

  // Shto të dhënat tek socket
  socket.userData = {
    username,
    room,
    token: token || null
  };

  next();
};

module.exports = socketMiddleware;