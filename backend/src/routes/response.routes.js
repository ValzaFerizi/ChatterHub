const express = require('express');
const ResponseController = require('../controllers/response.controller');

const router = express.Router();

router.post('/forms/:formId/responses', ResponseController.submitResponse);
router.get('/forms/:formId/responses', ResponseController.getResponsesByForm);
router.get('/responses/:responseId', ResponseController.getResponseById);
router.delete('/responses/:responseId', ResponseController.deleteResponse);

module.exports = router;
