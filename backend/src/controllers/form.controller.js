@'
const FormRepository = require('../repositories/form.repository');

const FormController = {
  async createForm(req, res) {
    try {
      const form = await FormRepository.createForm(req.body);
      return res.status(201).json({
        message: 'Form created successfully',
        data: form
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to create form',
        error: error.message
      });
    }
  },

  async getForms(req, res) {
    try {
      const ownerId = req.user?.id || req.query.ownerId;
      const forms = await FormRepository.findFormsByOwner(ownerId);

      return res.status(200).json({
        message: 'Forms fetched successfully',
        data: forms
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch forms',
        error: error.message
      });
    }
  },

  async getFormById(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormRepository.findFormById(formId);

      if (!form) {
        return res.status(404).json({
          message: 'Form not found'
        });
      }

      return res.status(200).json({
        message: 'Form fetched successfully',
        data: form
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch form',
        error: error.message
      });
    }
  },

  async updateForm(req, res) {
    try {
      const { formId } = req.params;
      const updatedForm = await FormRepository.updateForm(formId, req.body);

      return res.status(200).json({
        message: 'Form updated successfully',
        data: updatedForm
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to update form',
        error: error.message
      });
    }
  },

  async deleteForm(req, res) {
    try {
      const { formId } = req.params;
      await FormRepository.deleteForm(formId);

      return res.status(200).json({
        message: 'Form deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to delete form',
        error: error.message
      });
    }
  }
};

module.exports = FormController;
'@ | Set-Content backend\src\controllers\form.controller.js
