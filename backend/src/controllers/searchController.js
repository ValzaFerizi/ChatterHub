const { Op } = require('sequelize');
const { Form, User, Question, Response, Section } = require('../models');

const search = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

    const results = {};

    if (!type || type === 'forms') {
      results.forms = await Form.findAll({
        where: { title: { [Op.like]: `%${q}%` } },
        attributes: ['id', 'title', 'description', 'createdAt'],
        limit: 10
      });
    }

    if (!type || type === 'users') {
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
      results.questions = await Question.findAll({
        where: { label: { [Op.like]: `%${q}%` } },
        attributes: ['id', 'label', 'type', 'formId'],
        limit: 10
      });
    }

    if (!type || type === 'sections') {
      results.sections = await Section.findAll({
        where: { title: { [Op.like]: `%${q}%` } },
        attributes: ['id', 'title', 'formId'],
        limit: 10
      });
    }

    if (!type || type === 'responses') {
      results.responses = await Response.findAll({
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
