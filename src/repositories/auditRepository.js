const AuditLog = require('../models/mongo/AuditLog');

const createLog = async (userId, action, entity, entityId, oldValue, newValue, ipAddress) => {
  return await AuditLog.create({
    user_id: userId,
    action,
    entity,
    entity_id: entityId,
    old_value: oldValue || null,
    new_value: newValue || null,
    ip_address: ipAddress
  });
};

const getAllLogs = async () => {
  return await AuditLog.find().sort({ created_at: -1 });
};

const getLogsByUser = async (userId) => {
  return await AuditLog.find({ user_id: userId }).sort({ created_at: -1 });
};

module.exports = { createLog, getAllLogs, getLogsByUser };
