const activeUsers = new Map();

const presenceService = {
  addUser: (socketId, userData) => {
    activeUsers.set(socketId, {
      ...userData,
      joinedAt: new Date()
    });
  },

  removeUser: (socketId) => {
    activeUsers.delete(socketId);
  },

  getActiveUsers: () => {
    return Array.from(activeUsers.values());
  },

  getUser: (socketId) => {
    return activeUsers.get(socketId);
  }
};

module.exports = presenceService;