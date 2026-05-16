const { blacklistToken } = require('./tokenService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../repositories/authRepository');
const { logAction } = require('./auditService');

const register = async (first_name, last_name, email, password) => {
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), first_name, last_name, email, password_hash };
  createUser(user);

    ogAction(user.id, 'REGISTER', 'User', user.id, null, email, ipAddress)
  return { message: 'User registered successfully' };
;
};

const login = async (email, password) => {
  const user = findUserByEmail(email);
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

  logAction(user.id, 'LOGIN', 'User', user.id, null, email, ipAddress);  
  return { accessToken, refreshToken };
  
};

const refreshAccessToken = (refreshToken) => {
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

const logout = async (token) => {
  await blacklistToken(token, 15 * 60);
  return { message: 'Logged out successfully' };
};

module.exports = { register, login, refreshAccessToken, logout };