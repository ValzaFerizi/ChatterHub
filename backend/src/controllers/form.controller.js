const FormRepository = require('../repositories/form.repository');
const { logAction } = require('../services/auditService');

const FormController = {

  async createForm(req, res) {
    try {
      const formData = { ...req.body, ownerId: req.user?.id };
      const form = await FormRepository.createForm(formData);
      if (req.user?.id) {
        await logAction(req.user.id, 'CREATE_FORM', 'Form', form.id, null, form.title, req.ip);
      }
      return res.status(201).json({ message: 'Form created successfully', data: form });
    } catch (error) {
      console.error("CREATE FORM ERROR:", error);
      return res.status(500).json({ message: "Failed to create form", error: error.message });
    }
  },

  async getForms(req, res) {
  try {
    const forms = await FormRepository.findAll();
    return res.status(200).json({ message: 'Forms fetched successfully', data: forms });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch forms', error: error.message });
  }
},

  async getFormById(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormRepository.findFormById(formId);
      if (!form) return res.status(404).json({ message: 'Form not found' });
      return res.status(200).json({ message: 'Form fetched successfully', data: form });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch form', error: error.message });
    }
  },

  async updateForm(req, res) {
    try {
      const { formId } = req.params;
      const updatedForm = await FormRepository.updateForm(formId, req.body);
      if (!updatedForm) return res.status(404).json({ message: 'Form not found' });
      if (req.user?.id) {
        await logAction(req.user.id, 'UPDATE_FORM', 'Form', formId, null, req.body.title, req.ip);
      }
      return res.status(200).json({ message: 'Form updated successfully', data: updatedForm });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update form', error: error.message });
    }
  },

  async deleteForm(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormRepository.findFormById(formId);
      const deleted = await FormRepository.deleteForm(formId);
      if (!deleted) return res.status(404).json({ message: 'Form not found' });
      if (req.user?.id) {
        await logAction(req.user.id, 'DELETE_FORM', 'Form', formId, form?.title, null, req.ip);
      }
      return res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete form', error: error.message });
    }
  },

  async publishForm(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormRepository.publishForm(formId);
      if (!form) return res.status(404).json({ message: 'Form not found' });
      return res.status(200).json({ message: 'Form published successfully', data: form });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to publish form', error: error.message });
    }
  },

  async unpublishForm(req, res) {
    try {
      const { formId } = req.params;
      const form = await FormRepository.unpublishForm(formId);
      if (!form) return res.status(404).json({ message: 'Form not found' });
      return res.status(200).json({ message: 'Form unpublished successfully', data: form });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to unpublish form', error: error.message });
    }
  }

};

module.exports = FormController;