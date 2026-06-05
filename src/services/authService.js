const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, findUserById, createUser } = require('../repositories/authRepository');
const { saveRefreshToken, findRefreshToken, revokeAllUserTokens } = require('../repositories/refreshTokenRepository');
const { assignRoleToUser, findRoleByName } = require('../repositories/roleRepository');
const { blacklistToken, setSession, deleteSession } = require('./tokenService');
const { logAction } = require('./auditService');

const register = async (first_name, last_name, email, password, ipAddress) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error('Email already exists');

  const password_hash = await bcrypt.hash(password, 10);
  const user = await createUser({ first_name, last_name, email, password_hash });

  const defaultRole = await findRoleByName('user');
  if (defaultRole) await assignRoleToUser(user.id, defaultRole.id);

  await logAction(user.id, 'REGISTER', 'User', user.id, null, email, ipAddress);
  return { message: 'User registered successfully' };
};

const login = async (email, password, ipAddress) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid credentials');

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await saveRefreshToken(user.id, refreshToken, expiresAt);
  await setSession(user.id, { email: user.email }, 7 * 24 * 60 * 60);

  await logAction(user.id, 'LOGIN', 'User', user.id, null, email, ipAddress);
  return { accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
  const storedToken = await findRefreshToken(refreshToken);
  if (!storedToken) throw new Error('Invalid or expired refresh token');

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    return { accessToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

const logout = async (token, userId) => {
  await blacklistToken(token, 15 * 60);
  if (userId) await revokeAllUserTokens(userId);
  await deleteSession(userId);
  return { message: 'Logged out successfully' };
};

module.exports = { register, login, refreshAccessToken, logout };
