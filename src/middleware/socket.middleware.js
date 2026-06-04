const jwt = require('jsonwebtoken');

const socketMiddleware = (socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.query?.token;

  if (!token) {
    return next(new Error('Token mungon! Duhet te jesh i loguar.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.userData = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username || decoded.email.split('@')[0]
    };

    next();

  } catch (err) {
    return next(new Error('Token i pavlefshem ose i skaduar!'));
  }
};

module.exports = socketMiddleware;