const forms = new Map();

const formService = {
  // Krijo form të ri
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

  // Merr form-in
  getForm: (formId) => {
    return forms.get(formId) || null;
  },

  // Përditëso një field
  updateField: (formId, fieldId, value, updatedBy) => {
    if (!forms.has(formId)) {
      formService.createForm(formId);
    }

    const form = forms.get(formId);
    form.fields[fieldId] = {
      value,
      updatedBy,
      updatedAt: new Date()
    };
    form.updatedAt = new Date();

    return form.fields[fieldId];
  },

  // Shto përgjigje të re
  addResponse: (formId, answers, submittedBy) => {
    if (!forms.has(formId)) {
      formService.createForm(formId);
    }

    const form = forms.get(formId);
    const response = {
      id: Date.now(),
      answers,
      submittedBy,
      submittedAt: new Date()
    };

    form.responses.push(response);
    return response;
  },

  // Merr të gjitha përgjigjet
  getResponses: (formId) => {
    const form = forms.get(formId);
    if (!form) return [];
    return form.responses;
  },

  // Merr numrin e përgjigjeve
  getResponseCount: (formId) => {
    const form = forms.get(formId);
    if (!form) return 0;
    return form.responses.length;
  }
};

module.exports = formService;