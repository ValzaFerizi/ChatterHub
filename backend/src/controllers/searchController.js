const { Op } = require('sequelize');
const { Form, User, Question, Response } = require('../models');
const { getUserRoles } = require('../repositories/roleRepository');

const search = async (req, res) => {
  try {
    let { q, type } = req.query;
    if (!q || q === "*") q = "";

    const userId = req.user.id;
    const userRoles = await getUserRoles(userId);
    const isAdmin = userRoles.some(r => r.name === 'admin');

    const results = {};

    if (!type || type === 'forms') {
      const where = { title: { [Op.like]: `%${q}%` } };
      if (!isAdmin) where.ownerId = userId;
      results.forms = await Form.findAll({
        where,
        attributes: ['id', 'title', 'description', 'createdAt'],
        limit: 10
      });
    }

    if ((!type || type === 'users') && isAdmin) {
      results.users = await User.findAll({
        where: {
          [Op.or]: [
            { first_name: { [Op.like]: `%${q}%` } },
            { last_name: { [Op.like]: `%${q}%` } },
            { email: { [Op.like]: `%${q}%` } }
          ]
        },
        attributes: ['id', 'first_name', 'last_name', 'email', 'is_active'],
        limit: 10
      });
    }

    if (!type || type === 'questions') {
      const formWhere = isAdmin ? {} : { ownerId: userId };
      const userForms = await Form.findAll({ where: formWhere, attributes: ['id'] });
      const formIds = userForms.map(f => f.id);
      results.questions = await Question.findAll({
        where: {
          label: { [Op.like]: `%${q}%` },
          formId: { [Op.in]: formIds.length ? formIds : [0] }
        },
        attributes: ['id', 'label', 'type', 'formId'],
        limit: 10
      });
    }

    if (type === 'responses') {
      const formWhere = isAdmin ? {} : { ownerId: userId };
      const userForms = await Form.findAll({ where: formWhere, attributes: ['id'] });
      const formIds = userForms.map(f => f.id);
      results.responses = await Response.findAll({
        where: { formId: { [Op.in]: formIds.length ? formIds : [0] } },
        attributes: ['id', 'formId', 'createdAt'],
        limit: 10
      });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { search };
