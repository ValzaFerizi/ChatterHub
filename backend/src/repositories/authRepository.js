const { User, Role } = require('../models');

const findUserByEmail = async (email) => {
  return await User.findOne({
    where: { email },
    include: [{ model: Role, as: 'roles', through: { attributes: [] } }]
  });
};

const findUserById = async (id) => {
  return await User.findByPk(id, {
    include: [{ model: Role, as: 'roles', through: { attributes: [] } }]
  });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

module.exports = { findUserByEmail, findUserById, createUser };
