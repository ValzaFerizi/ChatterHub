@'
const ResponseRepository = require('../repositories/response.repository');

const ResponseController = {
  async submitResponse(req, res) {
    try {
      const { formId } = req.params;
      const respondentId = req.user?.id || req.body.respondentId || null;
      const { answers } = req.body;

      const response = await ResponseRepository.createResponseWithAnswers(
        formId,
        respondentId,
        answers
      );

      return res.status(201).json({
        message: 'Response submitted successfully',
        data: response
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to submit response',
        error: error.message
      });
    }
  },

  async getResponsesByForm(req, res) {
    try {
      const { formId } = req.params;
      const responses = await ResponseRepository.findResponsesByForm(formId);

      return res.status(200).json({
        message: 'Responses fetched successfully',
        data: responses
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch responses',
        error: error.message
      });
    }
  },

  async getResponseById(req, res) {
    try {
      const { responseId } = req.params;
      const response = await ResponseRepository.findResponseById(responseId);

      if (!response) {
        return res.status(404).json({
          message: 'Response not found'
        });
      }

      return res.status(200).json({
        message: 'Response fetched successfully',
        data: response
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch response',
        error: error.message
      });
    }
  },

  async deleteResponse(req, res) {
    try {
      const { responseId } = req.params;
      await ResponseRepository.deleteResponse(responseId);

      return res.status(200).json({
        message: 'Response deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to delete response',
        error: error.message
      });
    }
  }
};

module.exports = ResponseController;
'@ | Set-Content backend\src\controllers\response.controller.js