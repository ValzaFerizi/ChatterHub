@'
const express = require('express');
const SectionController = require('../controllers/section.controller');

const router = express.Router();

router.post('/forms/:formId/sections', SectionController.createSection);
router.get('/forms/:formId/sections', SectionController.getSectionsByForm);
router.put('/sections/:sectionId', SectionController.updateSection);
router.delete('/sections/:sectionId', SectionController.deleteSection);

module.exports = router;
'@ | Set-Content backend\src\routes\section.routes.js