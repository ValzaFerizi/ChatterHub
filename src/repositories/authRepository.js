const { User } = require('../models');

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const findUserById = async (id) => {
  return await User.findByPk(id);
};

const createUser = async (userData) => {
  return await User.create(userData);
};

module.exports = { findUserByEmail, findUserById, createUser };
