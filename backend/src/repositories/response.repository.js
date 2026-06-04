const { sequelize, Response, ResponseAnswer, Question } = require('../models');

function mapAnswerValue(value) {
  if (Array.isArray(value) || typeof value === 'object') {
    return { valueJson: value };
  }

  if (typeof value === 'number') {
    return { valueNumber: value };
  }

  if (typeof value === 'string') {
    return { valueText: value };
  }

  return { valueJson: value };
}

const ResponseRepository = {
  async createResponseWithAnswers(formId, respondentId, answers = []) {
    const transaction = await sequelize.transaction();

    try {
      const response = await Response.create(
        {
          formId,
          respondentId
        },
        { transaction }
      );

      const answerRows = answers.map((answer) => ({
        responseId: response.id,
        questionId: answer.questionId,
        ...mapAnswerValue(answer.value)
      }));

      if (answerRows.length > 0) {
        await ResponseAnswer.bulkCreate(answerRows, { transaction });
      }

      await transaction.commit();

      return Response.findByPk(response.id, {
        include: [
          {
            model: ResponseAnswer,
            as: 'answers',
            include: [
              {
                model: Question,
                as: 'question'
              }
            ]
          }
        ]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async findResponsesByForm(formId) {
    return Response.findAll({
      where: { formId },
      include: [
        {
          model: ResponseAnswer,
          as: 'answers',
          include: [
            {
              model: Question,
              as: 'question'
            }
          ]
        }
      ],
      order: [['submittedAt', 'DESC']]
    });
  },

  async findResponseById(responseId) {
    return Response.findByPk(responseId, {
      include: [
        {
          model: ResponseAnswer,
          as: 'answers',
          include: [
            {
              model: Question,
              as: 'question'
            }
          ]
        }
      ]
    });
  },

  async deleteResponse(responseId) {
    const response = await Response.findByPk(responseId);

    if (!response) {
      return null;
    }

    await response.destroy();
    return true;
  }
};

module.exports = ResponseRepository;