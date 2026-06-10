const FormRepository = require('../repositories/form.repository');
const { logAction } = require('../services/auditService');

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
        error: error.message || String(error)
      });
      const formData = { ...req.body, ownerId: req.user.id };
      const form = await FormRepository.createForm(formData);
      await logAction(req.user.id, 'CREATE_FORM', 'Form', form.id, null, form.title, req.ip);
      return res.status(201).json({ message: 'Form created successfully', data: form });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create form', error: error.message });
    }
  },

  async getForms(req, res) {
    try {
      const ownerId = req.user?.id || req.query.ownerId;

      if (!ownerId) {
        return res.status(400).json({
          message: 'ownerId is required'
        });
      }

      const forms = await FormRepository.findFormsByOwner(ownerId);
      return res.status(200).json({ message: 'Forms fetched successfully', data: forms });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch forms',
        error: error.message || String(error)
      });
    }
  },

  async getFormById(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormRepository.findFormById(formId);
      if (!form) return res.status(404).json({ message: 'Form not found' });
      return res.status(200).json({ message: 'Form fetched successfully', data: form });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch form',
        error: error.message || String(error)
      });
    }
  },

  async updateForm(req, res) {
    try {
      const { formId } = req.params;
      const updatedForm = await FormRepository.updateForm(formId, req.body);

      if (!updatedForm) {
        return res.status(404).json({
          message: 'Form not found'
        });
      }

      return res.status(200).json({
        message: 'Form updated successfully',
        data: updatedForm
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to update form',
        error: error.message || String(error)
      });
      await logAction(req.user.id, 'UPDATE_FORM', 'Form', formId, null, req.body.title, req.ip);
      return res.status(200).json({ message: 'Form updated successfully', data: updatedForm });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update form', error: error.message });
    }
  },

  async deleteForm(req, res) {
    try {
      const { formId } = req.params;
      const deleted = await FormRepository.deleteForm(formId);

      if (!deleted) {
        return res.status(404).json({
          message: 'Form not found'
        });
      }

      return res.status(200).json({
        message: 'Form deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to delete form',
        error: error.message || String(error)
      });
    }
  },

  async publishForm(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormRepository.publishForm(formId);

      if (!form) {
        return res.status(404).json({
          message: 'Form not found'
        });
      }

      return res.status(200).json({
        message: 'Form published successfully',
        data: form
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to publish form',
        error: error.message || String(error)
      });
    }
  },

  async unpublishForm(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormRepository.unpublishForm(formId);

      if (!form) {
        return res.status(404).json({
          message: 'Form not found'
        });
      }

      return res.status(200).json({
        message: 'Form unpublished successfully',
        data: form
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to unpublish form',
        error: error.message || String(error)
      });
      const form = await FormRepository.findFormById(formId);
      await FormRepository.deleteForm(formId);
      await logAction(req.user.id, 'DELETE_FORM', 'Form', formId, form?.title, null, req.ip);
      return res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete form', error: error.message });
    }
  }
};

module.exports = FormController;