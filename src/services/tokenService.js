const { client } = require('../config/redisClient');

const blacklistToken = async (token, expiresIn) => {
  await client.set(`blacklist:${token}`, 'true', { EX: expiresIn });
};

const isTokenBlacklisted = async (token) => {
  const result = await client.get(`blacklist:${token}`);
  return result === 'true';
};

const setSession = async (userId, data, expiresIn) => {
  await client.set(`session:${userId}`, JSON.stringify(data), { EX: expiresIn });
};

const getSession = async (userId) => {
  const data = await client.get(`session:${userId}`);
  return data ? JSON.parse(data) : null;
};

const deleteSession = async (userId) => {
  await client.del(`session:${userId}`);
};

module.exports = { blacklistToken, isTokenBlacklisted, setSession, getSession, deleteSession };