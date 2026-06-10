const { Form, Section, Question, QuestionOption } = require('../models');

const FormRepository = {
  async createForm(data) {
    return Form.create(data);
  },

  async findFormsByOwner(ownerId) {
    return Form.findAll({
      where: { ownerId },
      order: [['createdAt', 'DESC']]
    });
  },

  async findFormById(formId) {
    return Form.findByPk(formId, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Question,
              as: 'questions',
              include: [
                {
                  model: QuestionOption,
                  as: 'options'
                }
              ]
            }
          ]
        },
        {
          model: Question,
          as: 'questions',
          include: [
            {
              model: QuestionOption,
              as: 'options'
            }
          ]
        }
      ]
    });
  },

  async updateForm(formId, data) {
    const form = await Form.findByPk(formId);

    if (!form) {
      return null;
    }

    await form.update(data);
    return form;
  },

  async deleteForm(formId) {
    const form = await Form.findByPk(formId);

    if (!form) {
      return null;
    }

    await form.destroy();
    return true;
  },

  async publishForm(formId) {
    const form = await Form.findByPk(formId);

    if (!form) {
      return null;
    }

    await form.update({ isPublished: true });
    return form;
  },

  async unpublishForm(formId) {
    const form = await Form.findByPk(formId);

    if (!form) {
      return null;
    }

    await form.update({ isPublished: false });
    return form;
  }
};

module.exports = FormRepository;