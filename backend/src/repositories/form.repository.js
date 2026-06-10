const { Form, Section, Question, QuestionOption } = require('../models');

const FormRepository = {
  async createForm(data) {
  const { questions, ...formData } = data;
  
  const form = await Form.create(formData);
  
  if (questions && questions.length > 0) {
    await Promise.all(questions.map(async (q) => {
      const question = await Question.create({
        formId: form.id,
        label: q.label,
        type: q.type,
        is_required: q.is_required || false,
        order_index: q.order_index || 0
      });
      
      // Ruaj options nëse ka
      if (q.options && q.options.length > 0) {
        await Promise.all(q.options.map((opt, i) =>
          QuestionOption.create({
          questionId: question.id,
          label: typeof opt === 'string' ? opt : opt.label,
          value: typeof opt === 'string' ? opt : opt.label,
          order_index: i
          })
        ));
      }
    }));
  }
  
  return FormRepository.findFormById(form.id);
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