const mongoose = require('mongoose');
const AuditLog = require('../models/mongo/AuditLog');
const { User } = require('../models');

const createLog = async (userId, action, entity, entityId, oldValue, newValue, ipAddress) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️ Audit log skipped: MongoDB not connected');
    return null;
  }
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
  const logs = await AuditLog.find().sort({ created_at: -1 });
  const userIds = [...new Set(logs.map(l => l.user_id).filter(Boolean))];
  const users = await User.findAll({
    where: { id: userIds },
    attributes: ['id', 'first_name', 'last_name']
  });
  const userMap = {};
  users.forEach(u => { userMap[u.id] = `${u.first_name} ${u.last_name}`; });
  return logs.map(log => ({
    ...log.toObject(),
    user_name: userMap[log.user_id] || 'Unknown'
  }));
};

const getLogsByUser = async (userId) => {
  return await AuditLog.find({ user_id: userId }).sort({ created_at: -1 });
};

module.exports = { createLog, getAllLogs, getLogsByUser };
