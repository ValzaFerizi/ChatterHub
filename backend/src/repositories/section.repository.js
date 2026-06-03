const { Section, Question, QuestionOption } = require('../models');

const SectionRepository = {
  async createSection(formId, data) {
    return Section.create({
      ...data,
      formId
    });
  },

  async findSectionsByForm(formId) {
    return Section.findAll({
      where: { formId },
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
      ],
      order: [
        ['orderIndex', 'ASC'],
        [{ model: Question, as: 'questions' }, 'orderIndex', 'ASC'],
        [
          { model: Question, as: 'questions' },
          { model: QuestionOption, as: 'options' },
          'orderIndex',
          'ASC'
        ]
      ]
    });
  },

  async updateSection(sectionId, data) {
    const section = await Section.findByPk(sectionId);

    if (!section) {
      return null;
    }

    await section.update(data);
    return section;
  },

  async deleteSection(sectionId) {
    const section = await Section.findByPk(sectionId);

    if (!section) {
      return null;
    }

    await section.destroy();
    return true;
  }
};

module.exports = SectionRepository;