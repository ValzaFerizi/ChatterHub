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

  getUsersByForm: (formId) => {
    return Array.from(activeUsers.values()).filter(
      (user) => user.formId === formId
    );
  },

  getUsersBySheet: (sheetId) => {
    return Array.from(activeUsers.values()).filter(
      (user) => user.sheetId === sheetId
    );
  },

  getUser: (socketId) => {
    return activeUsers.get(socketId);
  }
};

module.exports = presenceService;