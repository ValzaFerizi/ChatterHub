const { register, login, refreshAccessToken, logout } = require('../services/authService');
const { findUserById } = require('../repositories/authRepository');

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const ipAddress = req.ip;
    const result = await register(first_name, last_name, email, password, ipAddress);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const result = await login(email, password, ipAddress);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
    const result = await refreshAccessToken(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const result = await logout(token, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const roles = user.roles ? user.roles.map(r => r.name) : [];
    res.status(200).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      roles: roles,
      isAdmin: roles.includes('admin')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { User, Role } = require("../models");
    const users = await User.findAll({ attributes: ['id', 'first_name', 'last_name', 'email', 'is_active', 'created_at'], include: [{ model: Role, as: 'roles', through: { attributes: [] } }] });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { User } = require('../models');
    const { id } = req.params;
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'Nuk mund te deaktivizosh veten' });
    }
    const targetUser = await User.findByPk(id);
    await User.update({ is_active: false }, { where: { id } });

    const io = req.app.get('io');
    if (io && targetUser) {
      io.sockets.sockets.forEach((socket) => {
        if (socket.userData && Number(socket.userData.id) === Number(id)) {
          socket.emit('notification', {
            type: 'account_deactivated',
            message: 'Llogaria juaj u deaktivizua nga administratori.',
            createdAt: new Date()
          });
        }
      });
    }

    res.status(200).json({ message: 'User u deaktivizua' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    const { assignRole } = require('../services/roleService');
    const { UserRole } = require('../models');
    await UserRole.destroy({ where: { user_id: userId } });
    await assignRole(userId, roleName);

    const io = req.app.get('io');
    if (io) {
      io.sockets.sockets.forEach((socket) => {
        if (socket.userData && Number(socket.userData.id) === Number(userId)) {
          socket.emit('notification', {
            type: 'role_updated',
            message: `Roli juaj u ndryshua në "${roleName}"`,
            createdAt: new Date()
          });
        }
      });
    }

    res.status(200).json({ message: 'Roli u ndryshua' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser, getProfile, getAllUsers, deactivateUser, updateUserRole };
