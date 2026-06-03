@'
const QuestionRepository = require('../repositories/question.repository');

const QuestionController = {
  async createQuestion(req, res) {
    try {
      const { formId } = req.params;
      const question = await QuestionRepository.createQuestionWithOptions(formId, req.body);

      return res.status(201).json({
        message: 'Question created successfully',
        data: question
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to create question',
        error: error.message
      });
    }
  },

  async getQuestionsByForm(req, res) {
    try {
      const { formId } = req.params;
      const questions = await QuestionRepository.findQuestionsByForm(formId);

      return res.status(200).json({
        message: 'Questions fetched successfully',
        data: questions
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch questions',
        error: error.message
      });
    }
  },

  async updateQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const updatedQuestion = await QuestionRepository.updateQuestion(questionId, req.body);

      return res.status(200).json({
        message: 'Question updated successfully',
        data: updatedQuestion
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to update question',
        error: error.message
      });
    }
  },

  async deleteQuestion(req, res) {
    try {
      const { questionId } = req.params;
      await QuestionRepository.deleteQuestion(questionId);

      return res.status(200).json({
        message: 'Question deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to delete question',
        error: error.message
      });
    }
  },

  async reorderQuestions(req, res) {
    try {
      const { formId } = req.params;
      const { orderedQuestionIds } = req.body;

      const result = await QuestionRepository.reorderQuestions(formId, orderedQuestionIds);

      return res.status(200).json({
        message: 'Questions reordered successfully',
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to reorder questions',
        error: error.message
      });
    }
  }
};

module.exports = QuestionController;
'@ | Set-Content backend\src\controllers\question.controller.js