const QuestionRepository = {
  async createQuestionWithOptions(formId, data) {
    // TODO: create question and options in database
  },

  async findQuestionsByForm(formId) {
    // TODO: find all questions for a form
  },

  async updateQuestion(questionId, data) {
    // TODO: update question
  },

  async deleteQuestion(questionId) {
    // TODO: delete question
  },

  async reorderQuestions(formId, orderedQuestionIds) {
    // TODO: update question order
  }
};

module.exports = QuestionRepository;
