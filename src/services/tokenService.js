const { client } = require('../config/redisClient');

const blacklistToken = async (token, expiresIn) => {
  await client.set(`blacklist:${token}`, 'true', { EX: expiresIn });
};

const isTokenBlacklisted = async (token) => {
  const result = await client.get(`blacklist:${token}`);
  return result === 'true';
};

module.exports = { blacklistToken, isTokenBlacklisted };