const { createLog, getAllLogs, getLogsByUser } = require('../repositories/auditRepository');

const logAction = (userId, action, entity, entityId, oldValue, newValue, ipAddress) => {
  return createLog(userId, action, entity, entityId, oldValue, newValue, ipAddress);
};

const getLogs = () => {
  return getAllLogs();
};

const getUserLogs = (userId) => {
  return getLogsByUser(userId);
};

module.exports = { logAction, getLogs, getUserLogs };