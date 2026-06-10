const mongoose = require('mongoose');
const BlacklistedToken = require('../models/mongo/BlacklistedToken');
const Session = require('../models/mongo/Session');

const isMongoConnected = () => mongoose.connection.readyState === 1;

const blacklistToken = async (token, expiresInSeconds) => {
  if (!isMongoConnected()) { console.warn('⚠️ Token blacklist skipped: MongoDB not connected'); return; }
  const expires_at = new Date(Date.now() + expiresInSeconds * 1000);
  await BlacklistedToken.create({ token, expires_at });
};

const isTokenBlacklisted = async (token) => {
  if (!isMongoConnected()) return false;
  const found = await BlacklistedToken.findOne({ token });
  return !!found;
};

const setSession = async (userId, data, expiresInSeconds) => {
  if (!isMongoConnected()) { console.warn('⚠️ Session save skipped: MongoDB not connected'); return; }
  const expires_at = new Date(Date.now() + expiresInSeconds * 1000);
  await Session.findOneAndUpdate(
    { user_id: userId },
    { user_id: userId, email: data.email, expires_at },
    { upsert: true, new: true }
  );
};

const getSession = async (userId) => {
  if (!isMongoConnected()) return null;
  return await Session.findOne({ user_id: userId });
};

const deleteSession = async (userId) => {
  if (!isMongoConnected()) return;
  await Session.deleteOne({ user_id: userId });
};

module.exports = { blacklistToken, isTokenBlacklisted, setSession, getSession, deleteSession };
