const BlacklistedToken = require('../models/mongo/BlacklistedToken');
const Session = require('../models/mongo/Session');

const blacklistToken = async (token, expiresInSeconds) => {
  const expires_at = new Date(Date.now() + expiresInSeconds * 1000);
  await BlacklistedToken.create({ token, expires_at });
};

const isTokenBlacklisted = async (token) => {
  const found = await BlacklistedToken.findOne({ token });
  return !!found;
};

const setSession = async (userId, data, expiresInSeconds) => {
  const expires_at = new Date(Date.now() + expiresInSeconds * 1000);
  await Session.findOneAndUpdate(
    { user_id: userId },
    { user_id: userId, email: data.email, expires_at },
    { upsert: true, new: true }
  );
};

const getSession = async (userId) => {
  return await Session.findOne({ user_id: userId });
};

const deleteSession = async (userId) => {
  await Session.deleteOne({ user_id: userId });
};

module.exports = { blacklistToken, isTokenBlacklisted, setSession, getSession, deleteSession };
