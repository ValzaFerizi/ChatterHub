const auditLogs = [];

const createLog = (userId, action, entity, entityId, oldValue, newValue, ipAddress) => {
  const log = {
    id: Date.now(),
    userId,
    action,
    entity,
    entityId,
    oldValue,
    newValue,
    ipAddress,
    created_at: new Date().toISOString()
  };
  auditLogs.push(log);
  return log;
};

const getAllLogs = () => {
  return auditLogs;
};

const getLogsByUser = (userId) => {
  return auditLogs.filter(log => log.userId === userId);
};

module.exports = { createLog, getAllLogs, getLogsByUser };