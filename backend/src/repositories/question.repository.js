const { sequelize, Question, QuestionOption } = require('../models');

const QuestionRepository = {
  async createQuestionWithOptions(formId, data) {
    const transaction = await sequelize.transaction();

    try {
      const { options = [], ...questionData } = data;

      const question = await Question.create(
        {
          ...questionData,
          formId
        },
        { transaction }
      );

      if (options.length > 0) {
        const optionRows = options.map((option, index) => ({
          questionId: question.id,
          label: option.label,
          value: option.value || option.label.toLowerCase().replace(/\s+/g, '_'),
          orderIndex: option.orderIndex ?? index
        }));

        await QuestionOption.bulkCreate(optionRows, { transaction });
      }

      await transaction.commit();

      return Question.findByPk(question.id, {
        include: [
          {
            model: QuestionOption,
            as: 'options'
          }
        ]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async findQuestionsByForm(formId) {
    return Question.findAll({
      where: { formId },
      include: [
        {
          model: QuestionOption,
          as: 'options'
        }
      ],
      order: [
        ['orderIndex', 'ASC'],
        [{ model: QuestionOption, as: 'options' }, 'orderIndex', 'ASC']
      ]
    });
  },

  async updateQuestion(questionId, data) {
    const transaction = await sequelize.transaction();

    try {
      const question = await Question.findByPk(questionId);

      if (!question) {
        await transaction.rollback();
        return null;
      }

      const { options, ...questionData } = data;

      await question.update(questionData, { transaction });

      if (Array.isArray(options)) {
        await QuestionOption.destroy({
          where: { questionId },
          transaction
        });

        if (options.length > 0) {
          const optionRows = options.map((option, index) => ({
            questionId,
            label: option.label,
            value: option.value || option.label.toLowerCase().replace(/\s+/g, '_'),
            orderIndex: option.orderIndex ?? index
          }));

          await QuestionOption.bulkCreate(optionRows, { transaction });
        }
      }

      await transaction.commit();

      return Question.findByPk(questionId, {
        include: [
          {
            model: QuestionOption,
            as: 'options'
          }
        ]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async deleteQuestion(questionId) {
    const question = await Question.findByPk(questionId);

    if (!question) {
      return null;
    }

    await question.destroy();
    return true;
  },

  async reorderQuestions(formId, orderedQuestionIds) {
    const transaction = await sequelize.transaction();

    try {
      const updates = orderedQuestionIds.map((questionId, index) => {
        return Question.update(
          { orderIndex: index },
          {
            where: {
              id: questionId,
              formId
            },
            transaction
          }
        );
      });

      await Promise.all(updates);
      await transaction.commit();

      return this.findQuestionsByForm(formId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = QuestionRepository;