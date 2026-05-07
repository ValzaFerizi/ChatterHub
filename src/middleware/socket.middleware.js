const socketMiddleware = (socket, next) => {
  const username = socket.handshake.query.username;
  const token = socket.handshake.query.token;

  if (!username) {
    return next(new Error('Username mungon!'));
  }

  socket.userData = {
    username,
    token: token || null
  };

  next();
};

module.exports = socketMiddleware;