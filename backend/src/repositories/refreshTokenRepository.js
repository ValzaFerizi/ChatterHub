const { RefreshToken } = require('../models');
const { Op } = require('sequelize');

const saveRefreshToken = async (userId, tokenHash, expiresAt) => {
  return await RefreshToken.create({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt
  });
};

const findRefreshToken = async (tokenHash) => {
  return await RefreshToken.findOne({
    where: {
      token_hash: tokenHash,
      revoked_at: null,
      expires_at: { [Op.gt]: new Date() }
    }
  });
};

const revokeRefreshToken = async (tokenHash) => {
  return await RefreshToken.update(
    { revoked_at: new Date() },
    { where: { token_hash: tokenHash } }
  );
};

const revokeAllUserTokens = async (userId) => {
  return await RefreshToken.update(
    { revoked_at: new Date() },
    { where: { user_id: userId, revoked_at: null } }
  );
};

module.exports = { saveRefreshToken, findRefreshToken, revokeRefreshToken, revokeAllUserTokens };
