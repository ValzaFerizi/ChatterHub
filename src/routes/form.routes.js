const express = require('express');
const router = express.Router();
const formService = require('../services/form.service');

// Merr form-in e plotë
router.get('/:formId', (req, res) => {
  const { formId } = req.params;
  const form = formService.getForm(formId);
  if (!form) {
    return res.status(404).json({ message: 'Form nuk u gjet!' });
  }
  res.json({ form });
});

// Merr të gjitha përgjigjet e një form-i
router.get('/:formId/responses', (req, res) => {
  const { formId } = req.params;
  const responses = formService.getResponses(formId);
  res.json({
    formId,
    totalResponses: responses.length,
    responses
  });
});

// Merr numrin e përgjigjeve
router.get('/:formId/responses/count', (req, res) => {
  const { formId } = req.params;
  const count = formService.getResponseCount(formId);
  res.json({ formId, totalResponses: count });
});

module.exports = router;