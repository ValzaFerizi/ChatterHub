const { createLog, getAllLogs, getLogsByUser } = require('../repositories/auditRepository');

const logAction = async (userId, action, entity, entityId, oldValue, newValue, ipAddress) => {
  try {
    return await createLog(userId, action, entity, entityId, oldValue, newValue, ipAddress);
  } catch (err) {
    console.warn('⚠️ Audit log failed:', err.message);
  }
};

const getLogs = () => {
  return getAllLogs();
};

const getUserLogs = (userId) => {
  return getLogsByUser(userId);
};

module.exports = { logAction, getLogs, getUserLogs };