const forms = new Map();

const formService = {

  createForm: (formId) => {
    if (!forms.has(formId)) {
      forms.set(formId, {
        id: formId,
        fields: {},
        responses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    return forms.get(formId);
  },

  getForm: (formId) => {
    return forms.get(formId) || null;
  },

  updateField: (formId, fieldId, value, updatedBy) => {
    if (!forms.has(formId)) {
      formService.createForm(formId);
    }
    const form = forms.get(formId);
    form.fields[fieldId] = { value, updatedBy, updatedAt: new Date() };
    form.updatedAt = new Date();
    return form.fields[fieldId];
  },

  addResponse: (formId, answers, userId) => {
    const form = forms.get(formId);
    if (!form) return null;

    const response = {
      id: Date.now(),
      answers,
      submittedBy: userId,
      submittedAt: new Date()
    };

    form.responses.push(response);
    return response;
  },

  getResponseCount: (formId) => {
    const form = forms.get(formId);
    return form ? form.responses.length : 0;
  },

  getResponses: (formId) => {
    const form = forms.get(formId);
    return form ? form.responses : [];
  }
};

module.exports = formService;